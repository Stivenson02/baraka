import { NextResponse } from "next/server";
import { issueSellerIntentToken } from "@/lib/contact-security";
import { handleApiError } from "@/lib/errors/handleApiError";
import { AppError } from "@/lib/errors/AppError";

const INTENT_PATH = "/api/seller-applications";

export async function GET() {
  try {
    const secret = process.env.CONTACT_FORM_SECRET;

    if (!secret) {
      throw new AppError("Formulario no configurado", 500, "CONTACT_FORM_NOT_CONFIGURED");
    }

    const token = issueSellerIntentToken(INTENT_PATH);

    return NextResponse.json({ success: true, data: { token } });
  } catch (error) {
    return handleApiError(error);
  }
}
