import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CambiarContrasenaClienteForm } from "@/components/customer/CambiarContrasenaClienteForm";
import { getCustomerMe } from "@/services/customer-auth.service";

export default async function CambiarContrasenaClientePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("baraka_customer_access")?.value;

  if (!accessToken) {
    redirect("/login/cliente");
  }

  let displayName = "";
  let requiresPasswordChange = false;

  try {
    const { data } = await getCustomerMe(accessToken);
    displayName = data.contact.name;
    requiresPasswordChange = data.customer.requiresPasswordChange;
  } catch {
    redirect("/login/cliente");
  }

  if (!requiresPasswordChange) {
    redirect("/cliente");
  }

  return <CambiarContrasenaClienteForm displayName={displayName} />;
}
