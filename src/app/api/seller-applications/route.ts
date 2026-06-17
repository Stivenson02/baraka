import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/handleApiError";
import { AppError } from "@/lib/errors/AppError";
import {
  isAllowedContactOrigin,
  isLikelyBotSubmission,
  verifySellerIntentToken,
} from "@/lib/contact-security";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  createSellerApplication,
  VALID_DOCUMENT_TYPES,
  type SellerApplicationPayload,
  type DocumentType,
} from "@/services/seller-applications.service";

const INTENT_PATH = "/api/seller-applications";

function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null
  );
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(`El campo ${field} es requerido`, 422, "VALIDATION_ERROR");
  }

  return value.trim();
}

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedContactOrigin(req.headers)) {
      throw new AppError("Origen no permitido", 403, "ORIGIN_NOT_ALLOWED");
    }

    let body: Record<string, unknown>;

    try {
      body = await req.json();
    } catch {
      throw new AppError("Body invalido", 400, "INVALID_JSON");
    }

    const turnstileToken = typeof body?.turnstileToken === "string" ? body.turnstileToken.trim() : "";

    if (!turnstileToken) {
      throw new AppError("Token captcha obligatorio", 400, "TURNSTILE_INVALID");
    }

    if (isLikelyBotSubmission({
      website: typeof body.website === "string" ? body.website : null,
      formStartedAt: typeof body.formStartedAt === "string" ? body.formStartedAt : null,
    })) {
      throw new AppError("Validacion de formulario fallida", 400, "BOT_CHECK_FAILED");
    }

    const intentToken = typeof body.intentToken === "string" ? body.intentToken : "";

    if (!intentToken || !verifySellerIntentToken(intentToken, INTENT_PATH)) {
      throw new AppError("Token de formulario invalido", 400, "INTENT_TOKEN_INVALID");
    }

    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`seller-app:${clientIp ?? "unknown"}`);

    if (!rateLimit.allowed) {
      throw new AppError("Demasiadas solicitudes. Intenta de nuevo en un momento.", 429, "RATE_LIMITED", {
        retryAfterMs: rateLimit.retryAfterMs,
      });
    }

    await verifyTurnstileToken(turnstileToken, clientIp ?? undefined);

    const documentType = requireString(body.documentType, "tipo de documento");

    if (!VALID_DOCUMENT_TYPES.includes(documentType as DocumentType)) {
      throw new AppError("Tipo de documento no valido", 422, "VALIDATION_ERROR");
    }

    const payload: SellerApplicationPayload = {
      firstName: requireString(body.firstName, "nombre"),
      lastName: requireString(body.lastName, "apellido"),
      documentType: documentType as DocumentType,
      documentNumber: requireString(body.documentNumber, "numero de documento"),
      email: requireString(body.email, "correo"),
      phone: requireString(body.phone, "celular"),
      address: requireString(body.address, "direccion"),
      ...(typeof body.middleName === "string" && body.middleName.trim()
        ? { middleName: body.middleName.trim() }
        : {}),
      ...(typeof body.secondLastName === "string" && body.secondLastName.trim()
        ? { secondLastName: body.secondLastName.trim() }
        : {}),
      ...(typeof body.cityId === "string" && body.cityId.trim()
        ? { cityId: body.cityId.trim() }
        : {}),
    };

    const data = await createSellerApplication(payload, clientIp);

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
