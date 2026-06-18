import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSellerMe } from "@/services/seller-auth.service";
import type { SellerUser } from "@/services/seller-auth.service";
import { AppError } from "@/lib/errors/AppError";
import { VendedorShell } from "@/components/vendedor/VendedorShell";

export default async function VendedorLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("baraka_seller_access")?.value;

  if (!accessToken) {
    redirect("/login/vendedor");
  }

  let user: SellerUser;

  try {
    const { data } = await getSellerMe(accessToken);
    user = data.user;
  } catch (error) {
    if (error instanceof AppError && error.code === "EXTERNAL_SESSION_EXPIRED") {
      redirect("/login/vendedor?reason=expired");
    }
    redirect("/login/vendedor");
  }

  if (user!.mustChangePassword) {
    redirect("/login/vendedor/cambiar-contrasena");
  }

  return <VendedorShell user={user!}>{children}</VendedorShell>;
}
