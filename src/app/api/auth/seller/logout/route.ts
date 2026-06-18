import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logoutSeller } from "@/services/seller-auth.service";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("baraka_seller_access")?.value;

  if (accessToken) {
    try {
      await logoutSeller(accessToken);
    } catch {
      // Revoke best-effort; clean cookies regardless
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete("baraka_seller_access");
  response.cookies.delete("baraka_seller_refresh");
  return response;
}
