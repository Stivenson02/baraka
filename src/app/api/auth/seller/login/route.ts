import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/handleApiError";
import { AppError } from "@/lib/errors/AppError";
import { loginSeller } from "@/services/seller-auth.service";

function cookieOptions(secure: boolean) {
  return { httpOnly: true, sameSite: "lax" as const, secure, path: "/" };
}

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      throw new AppError("Body invalido", 400, "INVALID_JSON");
    }

    const login = typeof body.login === "string" ? body.login.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!login) throw new AppError("El correo o usuario es requerido", 422, "VALIDATION_ERROR");
    if (!password) throw new AppError("La contrasena es requerida", 422, "VALIDATION_ERROR");

    const { data } = await loginSeller(login, password);

    const secure = process.env.NODE_ENV === "production";
    const now = Date.now();
    const accessMaxAge = Math.max(
      Math.floor((new Date(data.session.expiresAt).getTime() - now) / 1000),
      0
    );
    const refreshMaxAge = Math.max(
      Math.floor((new Date(data.session.refreshExpiresAt).getTime() - now) / 1000),
      0
    );

    const response = NextResponse.json({
      success: true,
      data: { user: data.user, business: data.business },
    });

    response.cookies.set("baraka_seller_access", data.session.accessToken, {
      ...cookieOptions(secure),
      maxAge: accessMaxAge,
    });
    response.cookies.set("baraka_seller_refresh", data.session.refreshToken, {
      ...cookieOptions(secure),
      maxAge: refreshMaxAge,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
