import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  Gift,
  HandCoins,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { brandAssets } from "@/lib/brand";

const businessModels = [
  {
    title: "Abastecimiento para empresas",
    description:
      "BARAKA conecta tu negocio con productos seleccionados, precios competitivos y una operacion pensada para comprar rapido, con respaldo y sin desgaste.",
    icon: PackageCheck,
  },
  {
    title: "Puntos Baraka para equipos",
    description:
      "Tu empresa carga presupuesto, lo convierte en puntos y los asigna a usuarios para que rediman productos dentro del catalogo BARAKA.",
    icon: WalletCards,
  },
];

const supplyBenefits = [
  "Productos seleccionados para negocios",
  "Precios pensados para compras empresariales",
  "Gestion comercial simple y acompanada",
  "Respaldo para compras recurrentes o por campana",
];

const pointsFlow = [
  {
    title: "La empresa carga presupuesto",
    description: "El saldo empresarial se transforma en puntos Baraka listos para asignar.",
    icon: Banknote,
  },
  {
    title: "Asigna puntos a usuarios",
    description: "Equipos, vendedores o aliados reciben puntos segun metas, incentivos o beneficios.",
    icon: Users,
  },
  {
    title: "Los usuarios redimen productos",
    description: "Cada usuario entra a BARAKA, consulta sus puntos y los usa en productos disponibles.",
    icon: Gift,
  },
];

const useCases = [
  "Incentivos para equipos comerciales",
  "Beneficios internos para colaboradores",
  "Premios por metas o campanas",
  "Compras empresariales de productos utiles",
];

export function EnterpriseLandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <section className="overflow-hidden bg-white">
          <div className="mx-auto grid min-h-[610px] w-full max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:px-8 lg:py-12">
            <div className="flex flex-col justify-center">
              <Badge className="mb-5 w-fit border-brand-purple/15 bg-brand-purple/10 text-brand-purple-dark hover:bg-brand-purple/10">
                BARAKA para empresas
              </Badge>

              <div className="relative mb-4 h-16 w-full max-w-xs">
                <Image
                  src={brandAssets.logoFull}
                  alt="BARAKA para empresas"
                  fill
                  priority
                  sizes="384px"
                  className="object-contain object-left"
                />
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-brand-text sm:text-5xl lg:text-5xl">
                Productos, puntos y beneficios para empresas que quieren moverse mejor
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-brand-muted">
                BARAKA ayuda a las empresas de dos formas: abasteciendo productos de valor
                y creando programas de puntos para que sus usuarios rediman productos dentro
                de una experiencia clara y confiable.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-[linear-gradient(135deg,#6D28D9_0%,#7C3AED_50%,#EC4899_100%)] text-white shadow-lg shadow-brand-purple/20 hover:opacity-95"
                >
                  <Link href="#modelo-puntos">
                    Ver modelo de puntos
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-brand-purple/20 text-brand-purple-dark hover:bg-brand-purple/5"
                >
                  <Link href="#contacto-empresas">
                    Hablar con BARAKA
                    <Building2 className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-x-8 top-10 h-72 rounded-full bg-brand-pink/10 blur-3xl" />
              <div className="relative w-full max-w-xl rounded-lg border border-brand-purple/10 bg-brand-soft p-4 shadow-xl shadow-brand-purple/10">
                <div className="rounded-lg bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-brand-muted">Vision empresarial</p>
                      <h2 className="mt-2 text-2xl font-semibold text-brand-text">
                        Un mismo catalogo, dos formas de generar valor
                      </h2>
                    </div>
                    <div className="relative size-16 shrink-0 rounded-lg bg-brand-purple/10">
                      <Image
                        src={brandAssets.isotipo}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    {businessModels.map((model) => {
                      const Icon = model.icon;

                      return (
                        <Card key={model.title} className="border-black/5 shadow-none">
                          <CardContent className="flex gap-4 p-4">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-brand-purple/10 text-brand-purple">
                              <Icon className="size-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-brand-text">{model.title}</p>
                              <p className="mt-1 text-sm leading-6 text-brand-muted">
                                {model.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex items-center gap-3 rounded-lg bg-brand-purple-dark px-4 py-3 text-white">
                    <ShieldCheck className="size-5 text-brand-orange" />
                    <p className="text-sm font-medium">
                      Compra empresarial y redencion de puntos en una experiencia BARAKA.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-brand-soft py-20">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <Badge className="bg-brand-orange text-white hover:bg-brand-orange">
                Abastecimiento empresarial
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold text-brand-text sm:text-4xl">
                Productos para empresas sin volver complejo el proceso
              </h2>
              <p className="mt-5 text-base leading-7 text-brand-muted">
                Para negocios que necesitan comprar mejor, BARAKA funciona como un aliado
                comercial: ayuda a conseguir productos seleccionados, negociar condiciones y
                mantener una compra mas simple, rapida y confiable.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {supplyBenefits.map((benefit) => (
                <div key={benefit} className="rounded-lg border border-black/5 bg-white p-5 shadow-sm">
                  <BadgeCheck className="size-5 text-brand-purple" />
                  <p className="mt-4 text-sm font-semibold leading-6 text-brand-text">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="modelo-puntos" className="bg-white py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="bg-brand-purple/10 text-brand-purple-dark hover:bg-brand-purple/10">
                Programa de puntos Baraka
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold text-brand-text sm:text-4xl">
                La empresa entrega puntos. El usuario elige que redimir.
              </h2>
              <p className="mt-5 text-base leading-7 text-brand-muted">
                El modelo de puntos permite convertir presupuesto empresarial en beneficios
                faciles de usar. La empresa controla la asignacion y cada usuario tiene una
                experiencia clara para consultar y redimir.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {pointsFlow.map((step, index) => {
                const Icon = step.icon;

                return (
                  <Card key={step.title} className="border-brand-purple/10 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex size-12 items-center justify-center rounded-md bg-brand-purple/10 text-brand-purple">
                          <Icon className="size-6" />
                        </div>
                        <span className="text-sm font-semibold text-brand-orange">
                          Paso {index + 1}
                        </span>
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-brand-text">{step.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-brand-muted">{step.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-brand-purple-dark py-20 text-white">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
            <div>
              <Badge className="bg-white/10 text-white hover:bg-white/10">
                Casos de uso
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                Un modelo flexible para equipos, ventas y beneficios internos
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-white/75">
                BARAKA puede ayudar tanto a compras empresariales como a programas de
                incentivos. La empresa define el presupuesto y las reglas; los usuarios
                viven una experiencia simple para acceder a productos.
              </p>
            </div>

            <div className="grid gap-3">
              {useCases.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/8 p-4">
                  <Sparkles className="size-5 shrink-0 text-brand-orange" />
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto-empresas" className="bg-white py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 rounded-lg border border-brand-purple/10 bg-brand-soft p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
              <div>
                <Badge className="bg-brand-purple/10 text-brand-purple-dark hover:bg-brand-purple/10">
                  Siguiente paso
                </Badge>
                <h2 className="mt-4 text-3xl font-semibold text-brand-text">
                  Preparemos el modelo correcto para tu empresa
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-brand-muted">
                  Podemos empezar por abastecimiento, puntos Baraka o una combinacion de ambos.
                  Los botones quedan listos para conectar el formulario comercial cuando el
                  backend del flujo empresarial este definido.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 md:min-w-[360px] md:grid-cols-1">
                <Button asChild className="bg-brand-orange text-white hover:bg-brand-orange/90">
                  <Link href="/#contacto">
                    <HandCoins className="size-4" />
                    Solicitar propuesta
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-brand-purple/20 bg-white text-brand-purple-dark hover:bg-brand-purple/5"
                >
                  <Link href="/#categorias">
                    <ShoppingBag className="size-4" />
                    Conocer catalogo empresarial
                  </Link>
                </Button>
              </div>
            </div>

            <Separator className="mt-12" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
