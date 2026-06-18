import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleApiError } from "@/lib/errors/handleApiError";
import { AppError } from "@/lib/errors/AppError";
import { refreshSellerSession } from "@/services/seller-auth.service";

function cookieOptions(secure: boolean) {
  return { httpOnly: true, sameSite: "lax" as const, secure, path: "/" };
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("baraka_seller_refresh")?.value;

    if (!refreshToken) {
      throw new AppError("Sin token de renovacion", 401, "UNAUTHENTICATED");
    }

    const { data } = await refreshSellerSession(refreshToken);

    const secure = process.env.NODE_ENV === "production";
    const now = Date.now();
    const accessMaxAge = Math.max(
      Math.floor((new Date(data.expiresAt).getTime() - now) / 1000),
      0
    );
    const refreshMaxAge = Math.max(
      Math.floor((new Date(data.refreshExpiresAt).getTime() - now) / 1000),
      0
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set("baraka_seller_access", data.accessToken, {
      ...cookieOptions(secure),
      maxAge: accessMaxAge,
    });
    response.cookies.set("baraka_seller_refresh", data.refreshToken, {
      ...cookieOptions(secure),
      maxAge: refreshMaxAge,
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
