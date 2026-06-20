"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgePercent,
  ChevronRight,
  Clock3,
  Gift,
  Headphones,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

import {
  brandAssets,
  commerceCategories,
  ecommerceProducts,
  promoBanners,
} from "@/lib/brand";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SellerApplicationDialog } from "@/components/seller/SellerApplicationDialog";
import { Button } from "@/components/ui/button";

type StorefrontSession = {
  type: "customer";
  name?: string;
  email?: string;
} | null;

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function StorefrontPage({ session }: { session: StorefrontSession }) {
  const [sellerDialogOpen, setSellerDialogOpen] = useState(false);
  const [sellerDialogKey, setSellerDialogKey] = useState(0);

  function openSellerDialog() {
    setSellerDialogKey((key) => key + 1);
    setSellerDialogOpen(true);
  }

  return (
    <>
      <SiteHeader variant="store" session={session} onOpenSellerDialog={openSellerDialog} />
      <main className="bg-brand-soft">
        <section className="border-b border-black/5 bg-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[220px_1fr_280px] lg:px-8">
            <aside
              id="categorias"
              className="hidden rounded-lg border border-black/5 bg-white p-3 shadow-sm lg:block"
            >
              <p className="mb-2 px-2 text-xs font-semibold uppercase text-brand-muted">
                Categorias
              </p>
              <div className="grid gap-1">
                {commerceCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.name}
                      href="/#productos"
                      className="flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium text-brand-text transition hover:bg-brand-soft"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="size-4 text-brand-purple-dark" />
                        {category.name}
                      </span>
                      <ChevronRight className="size-3 text-brand-muted" />
                    </Link>
                  );
                })}
              </div>
            </aside>

            <div className="relative min-h-[310px] overflow-hidden rounded-lg bg-brand-purple-dark text-white shadow-sm">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#4B1677_0%,#6D28D9_52%,#EC4899_100%)]" />
              <div className="absolute right-0 top-0 hidden h-full w-1/2 opacity-20 lg:block">
                <Image src={brandAssets.isotipo} alt="" fill className="object-contain" />
              </div>
              <div className="relative z-10 flex min-h-[310px] flex-col justify-between p-6 sm:p-8">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold">
                    <Sparkles className="size-3.5" />
                    Marketplace BARAKA
                  </span>
                  <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
                    Productos para comprar facil, vender mejor y activar promociones.
                  </h1>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-white/78 sm:text-base">
                    Una vitrina limpia para clientes y vendedores, con ofertas, categorias,
                    juegos comerciales y contacto siempre a la mano.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button asChild className="bg-white text-brand-purple-dark hover:bg-white/90">
                    <Link href="/#productos">
                      <ShoppingBag className="size-4" />
                      Comprar ahora
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white"
                    onClick={openSellerDialog}
                  >
                    Quiero vender
                  </Button>
                </div>
              </div>
            </div>

            <aside className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {promoBanners.map((banner) => (
                <div
                  key={banner.title}
                  className="rounded-lg border border-black/5 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand-purple-dark">
                    <BadgePercent className="size-5" />
                  </div>
                  <h2 className="text-base font-semibold text-brand-text">{banner.title}</h2>
                  <p className="mt-2 text-sm leading-5 text-brand-muted">{banner.description}</p>
                  {banner.href === "#quiero-vender" ? (
                    <button
                      type="button"
                      onClick={openSellerDialog}
                      className="mt-4 text-sm font-semibold text-brand-purple-dark"
                    >
                      {banner.cta}
                    </button>
                  ) : (
                    <Link
                      href={banner.href}
                      className="mt-4 inline-block text-sm font-semibold text-brand-purple-dark"
                    >
                      {banner.cta}
                    </Link>
                  )}
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              { label: "Envios preparados", icon: Truck },
              { label: "Pagos seguros", icon: ShieldCheck },
              { label: "Ofertas activas", icon: Gift },
              { label: "Soporte comercial", icon: Headphones },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg bg-brand-soft px-4 py-3">
                  <Icon className="size-5 text-brand-purple-dark" />
                  <span className="text-sm font-medium text-brand-text">{item.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section id="ofertas" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-orange">Campana activa</p>
                  <h2 className="mt-1 text-2xl font-bold text-brand-text">
                    Descuentos por primeras compras
                  </h2>
                </div>
                <div className="hidden items-center gap-2 rounded-lg bg-brand-soft px-3 py-2 text-sm font-semibold text-brand-purple-dark sm:flex">
                  <Clock3 className="size-4" />
                  Termina pronto
                </div>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-muted">
                Base lista para conectar reglas reales: cupones, juegos, metas por venta y
                descuentos por temporada.
              </p>
            </div>
            <div className="rounded-lg bg-brand-purple-dark p-5 text-white shadow-sm">
              <p className="text-sm font-semibold text-white/70">Para clientes registrados</p>
              <h2 className="mt-1 text-2xl font-bold">Beneficios y favoritos</h2>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Cuando haya sesion, el nav cambia a cuenta y dejamos listo el espacio para
                carrito, favoritos e historial.
              </p>
            </div>
          </div>
        </section>

        <section id="productos" className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-brand-purple-dark">Productos destacados</p>
              <h2 className="text-2xl font-bold text-brand-text">Lo que queremos empujar primero</h2>
            </div>
            <Link href="/baraka" className="hidden text-sm font-semibold text-brand-purple-dark sm:block">
              Conoce BARAKA
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ecommerceProducts.map((product) => (
              <article
                key={product.name}
                className="overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`relative flex aspect-[4/3] items-center justify-center ${product.color}`}>
                  <div className="absolute left-3 top-3 rounded-full bg-white px-2 py-1 text-xs font-semibold text-brand-purple-dark shadow-sm">
                    {product.badge}
                  </div>
                  <PackageCheck className="size-16 text-brand-purple-dark/70" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-medium text-brand-muted">{product.category}</p>
                  <h3 className="mt-1 min-h-10 text-sm font-semibold leading-5 text-brand-text">
                    {product.name}
                  </h3>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-lg font-bold text-brand-text">
                        {formatCOP(product.price)}
                      </p>
                      <p className="text-xs text-brand-muted line-through">
                        {formatCOP(product.beforePrice)}
                      </p>
                    </div>
                    <Button size="icon-lg" className="bg-brand-purple text-white hover:bg-brand-purple-hover">
                      <ShoppingBag className="size-4" />
                      <span className="sr-only">Agregar al carrito</span>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
            <div>
              <p className="text-sm font-semibold text-brand-orange">Contacto y ventas</p>
              <h2 className="mt-1 text-2xl font-bold text-brand-text">
                Dejamos cerca lo que convierte: contacto, venta y registro.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-muted">
                Este root queda como base del ecommerce. Despues conectamos catalogo real,
                filtros, producto detalle, carrito, checkout y reglas promocionales.
              </p>
            </div>
            <div className="grid gap-2">
              <Button type="button" className="bg-brand-purple text-white hover:bg-brand-purple-hover" onClick={openSellerDialog}>
                Quiero vender con BARAKA
              </Button>
              {!session && (
                <Button type="button" variant="outline" asChild>
                  <Link href="/login/cliente">Registrarme como cliente</Link>
                </Button>
              )}
              <Button type="button" variant="ghost" asChild>
                <Link href="/baraka">Ver informacion de BARAKA</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <SellerApplicationDialog
        key={sellerDialogKey}
        open={sellerDialogOpen}
        onOpenChange={setSellerDialogOpen}
      />
    </>
  );
}
