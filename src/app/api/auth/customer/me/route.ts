import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AppError } from "@/lib/errors/AppError";
import { handleApiError } from "@/lib/errors/handleApiError";
import { getCustomerMe } from "@/services/customer-auth.service";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("baraka_customer_access")?.value;

    if (!accessToken) {
      throw new AppError("No autenticado", 401, "UNAUTHENTICATED");
    }

    const { data } = await getCustomerMe(accessToken);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error);
  }
}
