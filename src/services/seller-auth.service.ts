import { lukranFetch } from "@/lib/lukranClient";

export interface SellerProfile {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  secondLastName?: string;
  documentNumber?: string;
  address?: string;
  phone?: string;
  city?: string;
  department?: string;
  country?: string;
}

export interface SellerUser {
  id: string;
  email: string;
  username: string;
  sellerCode?: string;
  lastLoginAt?: string;
  mustChangePassword: boolean;
  isActive: boolean;
  profile?: SellerProfile;
}

export interface SellerBusiness {
  id: string;
  name: string;
  identifier?: string;
}

export interface SellerSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  refreshExpiresAt: string;
}

export async function loginSeller(login: string, password: string) {
  return lukranFetch<{
    success: true;
    data: { user: SellerUser; business: SellerBusiness; session: SellerSession };
  }>({
    endpoint: "/api/connect/v1/external-auth/login",
    method: "POST",
    body: { login, password },
  });
}

export async function getSellerMe(accessToken: string) {
  return lukranFetch<{ success: true; data: { user: SellerUser; business: SellerBusiness } }>({
    endpoint: "/api/connect/v1/external-auth/me",
    method: "GET",
    extraHeaders: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function refreshSellerSession(refreshToken: string) {
  return lukranFetch<{ success: true; data: SellerSession }>({
    endpoint: "/api/connect/v1/external-auth/refresh",
    method: "POST",
    body: { refreshToken },
  });
}

export async function logoutSeller(accessToken: string) {
  return lukranFetch<{ success: true; data: { revoked: boolean } }>({
    endpoint: "/api/connect/v1/external-auth/logout",
    method: "POST",
    extraHeaders: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function changeSellerPassword(
  accessToken: string,
  newPassword: string,
  confirmPassword: string
) {
  return lukranFetch<{ success: true; data: { changed: boolean } }>({
    endpoint: "/api/connect/v1/external-auth/change-password",
    method: "POST",
    body: { newPassword, confirmPassword },
    extraHeaders: { Authorization: `Bearer ${accessToken}` },
  });
}
