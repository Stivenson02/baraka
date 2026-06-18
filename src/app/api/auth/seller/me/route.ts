import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleApiError } from "@/lib/errors/handleApiError";
import { AppError } from "@/lib/errors/AppError";
import { getSellerMe, refreshSellerSession } from "@/services/seller-auth.service";

function cookieOptions(secure: boolean) {
  return { httpOnly: true, sameSite: "lax" as const, secure, path: "/" };
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("baraka_seller_access")?.value;

    if (!accessToken) {
      throw new AppError("No autenticado", 401, "UNAUTHENTICATED");
    }

    try {
      const { data } = await getSellerMe(accessToken);
      return NextResponse.json({ success: true, data });
    } catch (firstError) {
      if (!(firstError instanceof AppError) || firstError.code !== "EXTERNAL_SESSION_EXPIRED") {
        throw firstError;
      }

      const refreshToken = cookieStore.get("baraka_seller_refresh")?.value;
      if (!refreshToken) {
        throw new AppError("Sesion expirada", 401, "EXTERNAL_SESSION_EXPIRED");
      }

      const { data: newSession } = await refreshSellerSession(refreshToken);
      const { data: meData } = await getSellerMe(newSession.accessToken);

      const secure = process.env.NODE_ENV === "production";
      const now = Date.now();
      const accessMaxAge = Math.max(
        Math.floor((new Date(newSession.expiresAt).getTime() - now) / 1000),
        0
      );
      const refreshMaxAge = Math.max(
        Math.floor((new Date(newSession.refreshExpiresAt).getTime() - now) / 1000),
        0
      );

      const response = NextResponse.json({ success: true, data: meData });
      response.cookies.set("baraka_seller_access", newSession.accessToken, {
        ...cookieOptions(secure),
        maxAge: accessMaxAge,
      });
      response.cookies.set("baraka_seller_refresh", newSession.refreshToken, {
        ...cookieOptions(secure),
        maxAge: refreshMaxAge,
      });
      return response;
    }
  } catch (error) {
    return handleApiError(error);
  }
}
