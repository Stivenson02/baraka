import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AppError } from "@/lib/errors/AppError";
import { handleApiError } from "@/lib/errors/handleApiError";
import { changeCustomerPassword } from "@/services/customer-auth.service";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("baraka_customer_access")?.value;

    if (!accessToken) {
      throw new AppError("No autenticado", 401, "UNAUTHENTICATED");
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      throw new AppError("Body invalido", 400, "INVALID_JSON");
    }

    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

    if (!newPassword || !confirmPassword) {
      throw new AppError("Los campos de contrasena son requeridos", 422, "VALIDATION_ERROR");
    }

    const { data } = await changeCustomerPassword(accessToken, newPassword, confirmPassword);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error);
  }
}
