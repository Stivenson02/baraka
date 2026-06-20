import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/errors/AppError";
import { handleApiError } from "@/lib/errors/handleApiError";
import { loginCustomer } from "@/services/customer-auth.service";

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

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email) throw new AppError("El correo es requerido", 422, "VALIDATION_ERROR");
    if (!password) throw new AppError("La contrasena es requerida", 422, "VALIDATION_ERROR");

    const { data } = await loginCustomer(email, password);
    const maxAge = Math.max(
      Math.floor((new Date(data.session.expiresAt).getTime() - Date.now()) / 1000),
      0
    );

    const response = NextResponse.json({
      success: true,
      data: {
        customer: data.customer,
        contact: data.contact,
        business: data.business,
      },
    });

    response.cookies.set("baraka_customer_access", data.session.accessToken, {
      ...cookieOptions(process.env.NODE_ENV === "production"),
      maxAge,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
