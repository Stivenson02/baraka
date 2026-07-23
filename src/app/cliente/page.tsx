import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CalendarDays, ShoppingBag, UserRound } from "lucide-react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { getHomeCategories } from "@/services/categories.service";
import { getCustomerMe } from "@/services/customer-auth.service";
import type { StorefrontCategory } from "@/types/category.type";

function formatDate(value: string | null) {
  if (!value) return "Primer ingreso";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function ClientePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("baraka_customer_access")?.value;

  if (!accessToken) {
    redirect("/login/cliente");
  }

  let session;
  try {
    session = await getCustomerMe(accessToken);
  } catch {
    redirect("/login/cliente");
  }

  const { customer, contact, business } = session.data;
  let categories: StorefrontCategory[] = [];

  if (customer.requiresPasswordChange) {
    redirect("/login/cliente/cambiar-contrasena");
  }

  try {
    const { data } = await getHomeCategories(6);
    categories = data.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.image?.file.url ?? null,
      order: category.order,
    }));
  } catch {
    // The customer area should still render if category navigation is unavailable.
  }

  return (
    <>
      <SiteHeader
        variant="store"
        session={{
          type: "customer",
          name: contact.name,
          email: customer.email,
        }}
        categories={categories}
      />
      <main className="min-h-screen bg-brand-soft">
        <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-brand-purple-dark">{business.name}</p>
          <h1 className="text-3xl font-bold text-brand-text">Hola, {contact.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted">
            Tu cuenta de cliente BARAKA ya esta activa. Esta primera vista deja lista la sesion
            para conectar carrito, checkout e historial de compras.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
            <UserRound className="mb-4 size-6 text-brand-purple-dark" />
            <p className="text-xs font-medium uppercase text-brand-muted">Correo</p>
            <p className="mt-1 break-words text-sm font-semibold text-brand-text">{customer.email}</p>
          </div>
          <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
            <CalendarDays className="mb-4 size-6 text-brand-orange" />
            <p className="text-xs font-medium uppercase text-brand-muted">Ultimo ingreso</p>
            <p className="mt-1 text-sm font-semibold text-brand-text">
              {formatDate(customer.lastLoginAt)}
            </p>
          </div>
          <div className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
            <ShoppingBag className="mb-4 size-6 text-brand-pink" />
            <p className="text-xs font-medium uppercase text-brand-muted">Compras</p>
            <p className="mt-1 text-sm font-semibold text-brand-text">En preparacion</p>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-brand-purple/10 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-brand-text">Tu experiencia de compra</h2>
          <p className="mb-5 text-sm leading-relaxed text-brand-muted">
            Por ahora dejamos autenticacion real, recuperacion y cambio de contrasena listos. El
            siguiente paso natural es conectar esta sesion con checkout, direcciones y pedidos.
          </p>
          <Button asChild className="bg-brand-purple-dark text-white hover:bg-brand-purple">
            <Link href="/">Volver a comprar</Link>
          </Button>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}
