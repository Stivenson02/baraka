import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleApiError } from "@/lib/errors/handleApiError";
import { AppError } from "@/lib/errors/AppError";
import { changeSellerPassword } from "@/services/seller-auth.service";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("baraka_seller_access")?.value;

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
      throw new AppError("Los campos de contraseña son requeridos", 422, "VALIDATION_ERROR");
    }

    await changeSellerPassword(accessToken, newPassword, confirmPassword);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
