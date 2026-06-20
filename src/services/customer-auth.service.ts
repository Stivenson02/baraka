import { lukranFetch } from "@/lib/lukranClient";

export interface CustomerContact {
  id: string;
  name: string;
  primaryEmail: string | null;
  primaryPhone: string | null;
}

export interface CustomerAccount {
  id: string;
  businessId: string;
  contactId: string;
  email: string;
  active: boolean;
  lastLoginAt: string | null;
  passwordChangedAt: string | null;
  requiresPasswordChange: boolean;
}

export interface CustomerBusiness {
  id: string;
  name: string;
  domain: string | null;
}

export interface CustomerSession {
  accessToken: string;
  expiresAt: string;
}

export interface CustomerAuthData {
  customer: CustomerAccount;
  contact: CustomerContact;
  business: CustomerBusiness;
}

export async function registerCustomer(name: string, email: string, phone: string | null) {
  return lukranFetch<{ success: true; data: CustomerAuthData & { message: string } }>({
    endpoint: "/api/connect/v1/customer-auth/register",
    method: "POST",
    body: { name, email, phone },
  });
}

export async function loginCustomer(email: string, password: string) {
  return lukranFetch<{ success: true; data: CustomerAuthData & { session: CustomerSession } }>({
    endpoint: "/api/connect/v1/customer-auth/login",
    method: "POST",
    body: { email, password },
  });
}

export async function getCustomerMe(accessToken: string) {
  return lukranFetch<{ success: true; data: CustomerAuthData }>({
    endpoint: "/api/connect/v1/customer-auth/me",
    method: "GET",
    extraHeaders: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function changeCustomerPassword(
  accessToken: string,
  newPassword: string,
  confirmPassword: string
) {
  return lukranFetch<{
    success: true;
    data: { changed: boolean; requiresPasswordChange: boolean };
  }>({
    endpoint: "/api/connect/v1/customer-auth/change-password",
    method: "POST",
    body: { newPassword, confirmPassword },
    extraHeaders: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function resetCustomerPassword(email: string) {
  return lukranFetch<{ success: true; data: { message: string } }>({
    endpoint: "/api/connect/v1/customer-auth/reset-password",
    method: "POST",
    body: { email },
  });
}

export async function logoutCustomer(accessToken: string) {
  return lukranFetch<{ success: true; data: { revoked: boolean } }>({
    endpoint: "/api/connect/v1/customer-auth/logout",
    method: "POST",
    extraHeaders: { Authorization: `Bearer ${accessToken}` },
  });
}
