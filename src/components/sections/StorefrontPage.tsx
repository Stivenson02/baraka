"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ChevronRight,
  Gift,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { commerceCategories } from "@/lib/brand";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { NewsletterSignupForm } from "@/components/sections/NewsletterSignupForm";
import { ProductCatalogSection } from "@/components/sections/ProductCatalogSection";
import { SecondaryPromoCarousel } from "@/components/sections/SecondaryPromoCarousel";
import { StorefrontHeroBanner } from "@/components/sections/StorefrontHeroBanner";
import type { StorefrontCategory } from "@/types/category.type";

type StorefrontSession = {
  type: "customer";
  name?: string;
  email?: string;
} | null;

type VisualCategory = {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
};

export function StorefrontPage({
  session,
  categories,
}: {
  session: StorefrontSession;
  categories: StorefrontCategory[];
}) {
  const visualCategories = getVisualCategories(categories);

  return (
    <>
      <SiteHeader variant="store" session={session} categories={categories} />
      <main className="bg-brand-soft">
        <section className="border-b border-black/5 bg-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
            <aside
              id="categorias"
              className="hidden rounded-lg border border-black/5 bg-white p-3 shadow-sm lg:block"
            >
              <p className="mb-2 px-2 text-xs font-semibold uppercase text-brand-muted">
                Categorias
              </p>
              <div className="grid max-h-[252px] gap-1 overflow-y-auto pr-1">
                {visualCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.id}
                      href={category.href}
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

            <StorefrontHeroBanner />
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
            <NewsletterSignupForm />
            <SecondaryPromoCarousel />
          </div>
        </section>

        <ProductCatalogSection />
      </main>
      <SiteFooter />
    </>
  );
}

function getVisualCategories(categories: StorefrontCategory[]): VisualCategory[] {
  if (categories.length) {
    return categories.map((category, index) => ({
      id: category.id,
      name: category.name,
      href: "/#productos",
      icon: commerceCategories[index % commerceCategories.length].icon,
    }));
  }

  return commerceCategories.map((category, index) => ({
    id: `fallback-${index}-${category.name}`,
    name: category.name,
    href: "/#productos",
    icon: category.icon,
  }));
}
