import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginVendedorForm } from "@/components/seller/LoginVendedorForm";

export default async function LoginVendedorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; logout?: string }>;
}) {
  const cookieStore = await cookies();
  const hasSession = !!cookieStore.get("baraka_seller_access")?.value;

  if (hasSession) {
    redirect("/vendedor");
  }

  const params = await searchParams;

  return <LoginVendedorForm reason={params.reason} logout={params.logout} />;
}
