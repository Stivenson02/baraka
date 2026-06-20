import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/errors/AppError";
import { handleApiError } from "@/lib/errors/handleApiError";
import { resetCustomerPassword } from "@/services/customer-auth.service";

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      throw new AppError("Body invalido", 400, "INVALID_JSON");
    }

    const email = typeof body.email === "string" ? body.email.trim() : "";
    if (!email) throw new AppError("El correo es requerido", 422, "VALIDATION_ERROR");

    const { data } = await resetCustomerPassword(email);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error);
  }
}
