import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginClienteForm } from "@/components/customer/LoginClienteForm";

export default async function LoginClientePage() {
  const cookieStore = await cookies();
  const hasSession = !!cookieStore.get("baraka_customer_access")?.value;

  if (hasSession) {
    redirect("/cliente");
  }

  return <LoginClienteForm />;
}
