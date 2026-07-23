import { NextRequest, NextResponse } from "next/server";

import {
  isAllowedContactOriginIfPresent,
  issuePublicFormIntentToken,
} from "@/lib/contact-security";
import { AppError } from "@/lib/errors/AppError";
import { handleApiError } from "@/lib/errors/handleApiError";
import { checkRateLimit } from "@/lib/rate-limit";

const INTENT_PATH = "/api/newsletter";

function getIpFromRequest(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function GET(req: NextRequest) {
  try {
    if (!isAllowedContactOriginIfPresent(req.headers)) {
      throw new AppError("Origen no permitido", 403, "CONTACT_SECURITY_CHECK_FAILED");
    }

    const rateLimit = checkRateLimit(`newsletter-intent:${getIpFromRequest(req)}`, {
      maxAttempts: 20,
      windowMs: 60_000,
    });

    if (!rateLimit.allowed) {
      throw new AppError("Demasiadas solicitudes", 429, "CONTACT_RATE_LIMITED", {
        retryAfterMs: rateLimit.retryAfterMs,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        token: issuePublicFormIntentToken(INTENT_PATH),
        expiresIn: 600,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
