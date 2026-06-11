import { benefits } from "@/lib/brand";
import { Card, CardContent } from "@/components/ui/card";

export function BenefitsSection() {
  return (
    <section className="bg-brand-soft py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-purple">
            Beneficios BARAKA
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-brand-text sm:text-4xl">
            Una plataforma comercial para comprar, vender y crecer con confianza
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <Card key={benefit.title} className="border-black/5 bg-white shadow-sm">
                <CardContent className="p-5">
                  <div className="flex size-11 items-center justify-center rounded-md bg-brand-purple/10 text-brand-purple">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-brand-text">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-brand-muted">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
