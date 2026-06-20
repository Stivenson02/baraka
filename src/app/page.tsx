import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { StorefrontPage } from "@/components/sections/StorefrontPage";
import { getCustomerMe } from "@/services/customer-auth.service";
import { getSellerMe } from "@/services/seller-auth.service";

type CustomerStoreSession = {
  type: "customer";
  name?: string;
  email?: string;
} | null;

export default async function Home() {
  const cookieStore = await cookies();
  const sellerAccessToken = cookieStore.get("baraka_seller_access")?.value;
  const customerAccessToken = cookieStore.get("baraka_customer_access")?.value;
  let customerSession: CustomerStoreSession = null;

  if (sellerAccessToken) {
    let sellerSessionIsValid = false;

    try {
      await getSellerMe(sellerAccessToken);
      sellerSessionIsValid = true;
    } catch {
      // If the seller cookie is stale, keep the store public instead of blocking visitors.
    }

    if (sellerSessionIsValid) {
      redirect("/vendedor");
    }
  }

  if (customerAccessToken) {
    let customerMustChangePassword = false;

    try {
      const { data } = await getCustomerMe(customerAccessToken);

      if (data.customer.requiresPasswordChange) {
        customerMustChangePassword = true;
      } else {
        customerSession = {
          type: "customer",
          name: data.contact.name,
          email: data.customer.email,
        };
      }
    } catch {
      // Same idea: expired customer cookie falls back to public ecommerce.
    }

    if (customerMustChangePassword) {
      redirect("/login/cliente/cambiar-contrasena");
    }
  }

  return <StorefrontPage session={customerSession} />;
}
