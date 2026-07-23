import { NextRequest, NextResponse } from "next/server";

import {
  isAllowedContactOrigin,
  isLikelyBotSubmission,
  verifyPublicFormIntentToken,
} from "@/lib/contact-security";
import { AppError } from "@/lib/errors/AppError";
import { handleApiError } from "@/lib/errors/handleApiError";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import {
  createContactInList,
  ensureNewsletterContactList,
} from "@/services/contact-lists.service";
import type { CreateContactInput } from "@/types/contact-list.type";

const INTENT_PATH = "/api/newsletter";

function getIpFromRequest(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null
  );
}

function trimText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePhone(value: string) {
  const phone = value.replace(/[^\d+]/g, "");

  if (phone.replace(/\D/g, "").length < 7 || phone.length > 20) {
    throw new AppError("Telefono invalido", 400, "CONTACT_PAYLOAD_INVALID");
  }

  return phone;
}

function normalizeNewsletterPayload(body: Record<string, unknown>): CreateContactInput {
  const name = trimText(body.name);
  const phone = normalizePhone(trimText(body.phone));
  const email = trimText(body.email).toLowerCase();

  if (name.length < 2 || name.length > 160) {
    throw new AppError("El nombre es obligatorio", 400, "CONTACT_NAME_REQUIRED");
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError("Correo invalido", 400, "CONTACT_PAYLOAD_INVALID");
  }

  return {
    formType: "newsletter",
    name,
    notes: "Lead capturado desde newsletter del home BARAKA.",
    contactType: "LEAD",
    temperature: "COLD",
    audienceType: "B2C",
    source: "FORM",
    active: true,
    phones: [{ number: phone, isPrimary: true, isWhatsapp: true, active: true }],
    emails: [{ email, isPrimary: true, active: true }],
  };
}

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedContactOrigin(req.headers)) {
      throw new AppError("Origen no permitido", 403, "CONTACT_SECURITY_CHECK_FAILED");
    }

    const body = (await req.json()) as Record<string, unknown>;
    const turnstileToken = trimText(body.turnstileToken);
    const intentToken = trimText(body.intentToken);
    const clientIp = getIpFromRequest(req);

    if (!turnstileToken) {
      throw new AppError("Token captcha obligatorio", 400, "TURNSTILE_INVALID");
    }

    if (
      isLikelyBotSubmission({
        website: trimText(body.website),
        formStartedAt: trimText(body.formStartedAt),
      })
    ) {
      throw new AppError("Validacion de formulario fallida", 400, "CONTACT_SECURITY_CHECK_FAILED");
    }

    if (!intentToken || !verifyPublicFormIntentToken(intentToken, INTENT_PATH)) {
      throw new AppError("Token de formulario invalido", 400, "CONTACT_SECURITY_CHECK_FAILED");
    }

    const rateLimit = checkRateLimit(`newsletter:${clientIp ?? "unknown"}`);

    if (!rateLimit.allowed) {
      throw new AppError("Demasiadas solicitudes", 429, "CONTACT_RATE_LIMITED", {
        retryAfterMs: rateLimit.retryAfterMs,
      });
    }

    const payload = normalizeNewsletterPayload(body);
    await verifyTurnstileToken(turnstileToken, clientIp ?? undefined);

    const list = await ensureNewsletterContactList();

    if (!list) {
      throw new AppError("Lista de newsletter no disponible", 503, "CONTACT_LIST_UNAVAILABLE");
    }

    const { data } = await createContactInList(list.id, payload, clientIp);

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
