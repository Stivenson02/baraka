import { ArrowRight } from "lucide-react";

import { categories } from "@/lib/brand";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function CategoriesSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Badge className="bg-brand-orange text-white hover:bg-brand-orange">
              Categorías destacadas
            </Badge>
            <h2 className="mt-4 text-3xl font-semibold text-brand-text sm:text-4xl">
              Un catálogo pensado para hogares, negocios y venta guiada
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-brand-muted">
            Mockup inicial de categorías para ordenar la experiencia ecommerce sin crear
            funcionalidades reales todavía.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isOffer = category.name === "Ofertas";

            return (
              <Card
                key={category.name}
                className="group overflow-hidden border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div
                    className={`h-2 ${
                      isOffer
                        ? "bg-brand-orange"
                        : index % 2 === 0
                          ? "bg-brand-purple"
                          : "bg-brand-pink"
                    }`}
                  />
                  <div className="p-5">
                    <div className="flex size-12 items-center justify-center rounded-md bg-brand-soft text-brand-purple-dark">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-brand-text">{category.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-brand-muted">{category.description}</p>
                    <div className="mt-5 flex items-center text-sm font-semibold text-brand-purple">
                      Ver colección
                      <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
