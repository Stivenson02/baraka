import Image from "next/image";

import { brandAssets, navItems } from "@/lib/brand";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <div className="relative h-16 w-48">
              <Image
                src={brandAssets.logo}
                alt="BARAKA"
                fill
                sizes="192px"
                className="object-contain object-left"
              />
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-brand-muted">
              BARAKA provee fácil, rápido y seguro. Productos de valor para hogares,
              negocios y aliadas.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-3 text-sm text-brand-muted sm:grid-cols-3">
            {navItems.map((item) => (
              <button key={item} className="text-left transition hover:text-brand-purple-dark">
                {item}
              </button>
            ))}
            <button className="text-left transition hover:text-brand-purple-dark">Términos</button>
          </nav>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 BARAKA. Marketplace colombiano.</p>
          <p>Compra fácil. Vende mejor. Crece con respaldo.</p>
        </div>
      </div>
    </footer>
  );
}
