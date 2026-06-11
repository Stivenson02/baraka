import Image from "next/image";
import { Building2, Goal, Handshake, TrendingUp, Users } from "lucide-react";

import { brandAssets } from "@/lib/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const allySteps = [
  { title: "Red interna", description: "Aliadas con acompañamiento, metas y beneficios claros.", icon: Users },
  { title: "Venta organizada", description: "Catálogo seleccionado y comunicación comercial consistente.", icon: Goal },
  { title: "Crecimiento con respaldo", description: "Una marca nacional seria detrás de cada oportunidad.", icon: TrendingUp },
];

export function AlliesBusinessSection() {
  return (
    <section className="bg-brand-soft py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative size-20 rounded-lg bg-brand-soft">
              <Image src={brandAssets.isotipo} alt="" fill sizes="80px" className="object-contain" />
            </div>
            <div>
              <Badge className="bg-brand-purple/10 text-brand-purple-dark hover:bg-brand-purple/10">
                Aliadas BARAKA
              </Badge>
              <h2 className="mt-2 text-3xl font-semibold text-brand-text">
                Venta cercana, organizada y con respaldo
              </h2>
            </div>
          </div>

          <p className="mt-5 text-base leading-7 text-brand-muted">
            Una red comercial cercana, organizada y con respaldo para llevar productos de valor
            a más hogares.
          </p>

          <div className="mt-8 grid gap-4">
            {allySteps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-purple/10 text-brand-purple">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-text">{step.title}</p>
                    <p className="text-sm leading-6 text-brand-muted">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button type="button" className="mt-8 bg-brand-purple text-white hover:bg-brand-purple-hover">
            <Handshake className="size-4" />
            Quiero vender con BARAKA
          </Button>
        </div>

        <Card className="border-brand-purple/10 bg-brand-purple-dark text-white shadow-sm">
          <CardContent className="p-6">
            <div className="relative h-24 w-72 max-w-full">
              <Image
                src={brandAssets.wordmark}
                alt="BARAKA"
                fill
                sizes="288px"
                className="object-contain object-left brightness-0 invert"
              />
            </div>
            <Separator className="my-6 bg-white/15" />
            <Badge className="bg-white/10 text-white hover:bg-white/10">Para empresas</Badge>
            <h2 className="mt-4 text-3xl font-semibold">
              Soluciones comerciales para negocios y aliados
            </h2>
            <p className="mt-5 leading-7 text-white/78">
              También proveemos soluciones para empresas, negocios y aliados comerciales que
              buscan productos confiables, disponibilidad y respaldo.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Disponibilidad", "Respaldo", "Volumen"].map((item) => (
                <div key={item} className="rounded-md border border-white/15 bg-white/8 p-4">
                  <Building2 className="size-5 text-brand-orange" />
                  <p className="mt-3 text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>

            <Button type="button" className="mt-8 bg-brand-orange text-white hover:bg-brand-orange/90">
              Hablar con ventas B2B
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
