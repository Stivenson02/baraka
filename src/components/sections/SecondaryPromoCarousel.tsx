"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";

const PROMOS = [
  {
    id: "home",
    eyebrow: "Promos para el hogar",
    title: "Ahorra en productos utiles para tu casa",
    description: "Combos, descuentos y novedades para comprar facil desde BARAKA.",
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "registered",
    eyebrow: "Clientes registrados",
    title: "Mas beneficios cuando inicias sesion",
    description: "Favoritos, descuentos especiales y opciones de pago directo cuando este activo.",
    image:
      "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "launch",
    eyebrow: "Lanzamiento BARAKA",
    title: "Ofertas listas para mover primeras compras",
    description: "Un espacio comercial para destacar campanas que luego administraremos desde LK.",
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=900&q=80",
  },
];

export function SecondaryPromoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePromo = PROMOS[activeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % PROMOS.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  function goToPrevious() {
    setActiveIndex((index) => (index - 1 + PROMOS.length) % PROMOS.length);
  }

  function goToNext() {
    setActiveIndex((index) => (index + 1) % PROMOS.length);
  }

  return (
    <div className="relative flex min-h-[430px] overflow-hidden rounded-lg bg-brand-purple-dark text-white shadow-sm lg:h-full">
      {PROMOS.map((promo, index) => (
        // Temporary remote promo images; later this component can read a LK webpage section.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={promo.id}
          src={promo.image}
          alt={promo.title}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          loading={index === 0 ? "eager" : "lazy"}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-purple-dark/70 via-brand-purple-dark/45 to-black/82" />

      <div className="relative z-10 flex w-full flex-col justify-between p-5">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-xs font-semibold text-white">
            <Sparkles className="size-3.5" />
            {activePromo.eyebrow}
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight">{activePromo.title}</h2>
          <p className="mt-3 text-sm leading-6 text-white/78">{activePromo.description}</p>
        </div>

        <div className="mt-8">
          <Button
            asChild
            className="w-full bg-white text-brand-purple-dark hover:bg-white/90"
          >
            <Link href="/#productos">
              <Tag className="size-4" />
              Ver productos
            </Link>
          </Button>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex gap-1.5">
              {PROMOS.map((promo, index) => (
                <button
                  key={promo.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex ? "w-7 bg-white" : "w-2 bg-white/40"
                  }`}
                  aria-label={`Ver promocion ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPrevious}
                className="flex size-9 items-center justify-center rounded-full bg-white/16 text-white transition hover:bg-white/24"
                aria-label="Promocion anterior"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="flex size-9 items-center justify-center rounded-full bg-white/16 text-white transition hover:bg-white/24"
                aria-label="Promocion siguiente"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
