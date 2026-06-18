import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Store } from "lucide-react";
import { brandAssets } from "@/lib/brand";

export default function LoginSelectorPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{
        background: "linear-gradient(135deg, #4B1677 0%, #6d28d9 55%, #7c3aed 100%)",
      }}
    >
      {/* Logo blanco */}
      <Link href="/" className="mb-10 block">
        <div className="relative h-12 w-40">
          <Image
            src={brandAssets.logoFull}
            alt="BARAKA"
            fill
            className="object-contain brightness-0 invert"
            priority
          />
        </div>
      </Link>

      <h1 className="text-2xl font-semibold text-white mb-2 text-center">
        ¿Cómo quieres ingresar?
      </h1>
      <p className="text-white/60 text-sm mb-8 text-center">
        Elige tu tipo de acceso a BARAKA
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        {/* Soy cliente — deshabilitado */}
        <div className="rounded-2xl bg-white/10 border border-white/15 p-6 flex flex-col items-center gap-3 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
            <ShoppingBag className="size-6 text-white/60" />
          </div>
          <div className="text-center">
            <h2 className="font-semibold text-white/80">Soy cliente</h2>
            <p className="text-xs text-white/50 mt-1">Quiero comprar en BARAKA</p>
          </div>
          <span className="mt-1 text-xs bg-white/10 text-white/50 px-3 py-1 rounded-full">
            Próximamente
          </span>
        </div>

        {/* Soy vendedor */}
        <Link
          href="/login/vendedor"
          className="rounded-2xl bg-white p-6 flex flex-col items-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group"
        >
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <Store className="size-6 text-brand-purple-dark" />
          </div>
          <div className="text-center">
            <h2 className="font-semibold text-brand-purple-dark">Ya tengo credenciales</h2>
            <p className="text-xs text-brand-muted mt-1">Ingresar como vendedor BARAKA</p>
          </div>
          <span className="mt-1 text-xs bg-accent text-brand-purple-dark px-3 py-1 rounded-full font-medium group-hover:bg-brand-purple-dark group-hover:text-white transition-colors">
            Acceder →
          </span>
        </Link>
      </div>

      <p className="mt-8 text-xs text-white/50 text-center">
        ¿Quieres unirte como vendedor?{" "}
        <Link href="/" className="text-white/80 hover:text-white underline underline-offset-2 font-medium transition-colors">
          Solicita tu acceso
        </Link>
      </p>
    </div>
  );
}
