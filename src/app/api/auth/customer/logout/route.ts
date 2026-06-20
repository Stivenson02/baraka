import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logoutCustomer } from "@/services/customer-auth.service";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("baraka_customer_access")?.value;

  if (accessToken) {
    try {
      await logoutCustomer(accessToken);
    } catch {
      // Logout is best-effort; BARAKA must always clear its local cookie.
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("baraka_customer_access");

  return response;
}
