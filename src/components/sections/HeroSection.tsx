import Image from "next/image";
import { ArrowRight, Search, ShieldCheck, ShoppingBag, Users } from "lucide-react";

import { brandAssets, commercePillars } from "@/lib/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid min-h-[720px] w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <Badge className="mb-5 w-fit border-brand-purple/15 bg-brand-purple/10 text-brand-purple-dark hover:bg-brand-purple/10">
            Marketplace colombiano premium
          </Badge>
          <div className="relative mb-6 h-28 w-full max-w-md sm:h-32 sm:max-w-lg">
            <Image
              src={brandAssets.logoFull}
              alt="BARAKA provee fácil, rápido y seguro"
              fill
              priority
              sizes="(max-width: 640px) 448px, 512px"
              className="object-contain object-left"
            />
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-brand-text sm:text-5xl lg:text-6xl">
            Todo lo que buscas, más cerca de ti
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-brand-muted">
            Productos para el hogar, marcas aliadas y oportunidades comerciales en una sola
            plataforma.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              size="lg"
              className="bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_50%,#EC4899_100%)] text-white shadow-lg shadow-brand-purple/20 hover:opacity-95"
            >
              Explorar productos
              <ArrowRight className="size-4" />
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="border-brand-purple/20 text-brand-purple-dark hover:bg-brand-purple/5"
            >
              Ser aliada BARAKA
              <Users className="size-4" />
            </Button>
          </div>

          <div className="mt-8 max-w-xl rounded-lg border border-black/5 bg-brand-soft p-2">
            <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 shadow-sm">
              <Search className="size-5 shrink-0 text-brand-muted" />
              <Input
                readOnly
                value="Busca hogar, cocina, ofertas o productos para emprender"
                className="h-10 border-0 bg-transparent p-0 text-sm text-brand-muted shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-x-6 top-8 h-72 rounded-full bg-brand-purple/10 blur-3xl" />
          <div className="relative w-full max-w-xl rounded-lg bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_52%,#EC4899_100%)] p-5 shadow-2xl shadow-brand-purple/20">
            <div className="rounded-lg bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-brand-muted">Propuesta comercial</p>
                  <h2 className="mt-2 text-2xl font-semibold text-brand-text">
                    Compra fácil. Vende mejor. Crece con respaldo.
                  </h2>
                </div>
                <div className="relative size-20 shrink-0 rounded-lg bg-brand-soft">
                  <Image src={brandAssets.isotipo} alt="" fill sizes="80px" className="object-contain" />
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {commercePillars.map((pillar) => {
                  const Icon = pillar.icon;

                  return (
                    <Card key={pillar.title} className="border-black/5 shadow-none">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex size-11 items-center justify-center rounded-md bg-brand-purple/10 text-brand-purple">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-brand-text">{pillar.title}</p>
                          <p className="text-sm text-brand-muted">{pillar.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-lg bg-brand-purple-dark px-4 py-3 text-white">
                <ShieldCheck className="size-5 text-brand-orange" />
                <p className="text-sm font-medium">BARAKA provee fácil, rápido y seguro.</p>
                <ShoppingBag className="ml-auto size-5 text-white/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
