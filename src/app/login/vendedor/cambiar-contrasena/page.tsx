import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSellerMe } from "@/services/seller-auth.service";
import { AppError } from "@/lib/errors/AppError";
import { CambiarContrasenaForm } from "@/components/seller/CambiarContrasenaForm";

export default async function CambiarContrasenaPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("baraka_seller_access")?.value;

  if (!accessToken) {
    redirect("/login/vendedor");
  }

  let displayName: string;

  try {
    const { data } = await getSellerMe(accessToken);

    if (!data.user.mustChangePassword) {
      redirect("/vendedor");
    }

    const profile = data.user.profile;
    displayName = profile?.firstName
      ? `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ""}`
      : data.user.username;
  } catch (error) {
    if (error instanceof AppError && error.code === "EXTERNAL_SESSION_EXPIRED") {
      redirect("/login/vendedor?reason=expired");
    }
    redirect("/login/vendedor");
  }

  return <CambiarContrasenaForm displayName={displayName!} />;
}
