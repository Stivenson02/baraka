"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";

import { brandAssets } from "@/lib/brand";
import { getImagesFromSection } from "@/lib/webpage";
import { Button } from "@/components/ui/button";
import type { WebPageSection } from "@/types/webpage.type";

type BannerImage = {
  id: string;
  url: string;
};

export function StorefrontHeroBanner() {
  const [images, setImages] = useState<BannerImage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const hasImages = images.length > 0;

  useEffect(() => {
    let active = true;

    async function fetchBanner() {
      try {
        const res = await fetch("/api/webpage/banner");
        const json = (await res.json()) as { data?: WebPageSection };

        if (active) {
          setImages(getImagesFromSection(json.data));
        }
      } catch {
        if (active) setImages([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchBanner();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [images.length]);

  function goToPrevious() {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  }

  function goToNext() {
    setActiveIndex((index) => (index + 1) % images.length);
  }

  return (
    <div className="relative min-h-[330px] overflow-hidden rounded-lg bg-brand-purple-dark text-white shadow-sm">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#4B1677_0%,#6D28D9_52%,#EC4899_100%)]" />

      {hasImages && (
        <div className="absolute inset-0">
          {images.map((banner, index) => (
            // Preserve remote LK banner rendering without coupling the MVP to image domains.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={banner.id}
              src={banner.url}
              alt={`banner-baraka-${index + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                index === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-purple-dark/92 via-brand-purple-dark/55 to-black/10" />
        </div>
      )}

      {!hasImages && (
        <>
          <div className="absolute right-0 top-0 hidden h-full w-1/2 opacity-20 lg:block">
            <Image src={brandAssets.isotipo} alt="" fill className="object-contain" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-black/10" />
        </>
      )}

      <div className="relative z-10 flex min-h-[330px] flex-col justify-between p-6 sm:p-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold">
            <Sparkles className="size-3.5" />
            Marketplace BARAKA
          </span>
          <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
            Productos para comprar facil, vender mejor y activar promociones.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/82 sm:text-base">
            Una vitrina limpia para clientes, con ofertas, categorias, juegos comerciales y
            contacto siempre a la mano.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild className="bg-white text-brand-purple-dark hover:bg-white/90">
            <Link href="/#productos">
              <ShoppingBag className="size-4" />
              Comprar ahora
            </Link>
          </Button>

          {loading && (
            <span className="text-xs font-medium text-white/70">Cargando promociones...</span>
          )}

          {images.length > 1 && (
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={goToPrevious}
                className="flex size-9 items-center justify-center rounded-full bg-white/16 text-white transition hover:bg-white/24"
                aria-label="Banner anterior"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="flex size-9 items-center justify-center rounded-full bg-white/16 text-white transition hover:bg-white/24"
                aria-label="Banner siguiente"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
