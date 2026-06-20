import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/errors/AppError";
import { handleApiError } from "@/lib/errors/handleApiError";
import { registerCustomer } from "@/services/customer-auth.service";

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      throw new AppError("Body invalido", 400, "INVALID_JSON");
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : null;

    if (!name) throw new AppError("El nombre es requerido", 422, "VALIDATION_ERROR");
    if (!email) throw new AppError("El correo es requerido", 422, "VALIDATION_ERROR");

    const { data } = await registerCustomer(name, email, phone);

    return NextResponse.json({
      success: true,
      data: {
        customer: data.customer,
        contact: data.contact,
        business: data.business,
        message: data.message,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
