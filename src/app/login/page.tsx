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

      <h1 className="mb-2 text-center text-2xl font-semibold text-white">
        Como quieres ingresar?
      </h1>
      <p className="mb-8 text-center text-sm text-white/60">Elige tu tipo de acceso a BARAKA</p>

      <div className="grid w-full max-w-lg grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/login/cliente"
          className="group flex flex-col items-center gap-3 rounded-lg bg-white p-6 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft">
            <ShoppingBag className="size-6 text-brand-orange" />
          </div>
          <div className="text-center">
            <h2 className="font-semibold text-brand-text">Soy cliente</h2>
            <p className="mt-1 text-xs text-brand-muted">Comprar y recuperar mi cuenta</p>
          </div>
          <span className="mt-1 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-purple-dark transition-colors group-hover:bg-brand-purple-dark group-hover:text-white">
            Entrar
          </span>
        </Link>

        <Link
          href="/login/vendedor"
          className="group flex flex-col items-center gap-3 rounded-lg border border-white/15 bg-white/10 p-6 backdrop-blur-sm transition-all duration-200 hover:bg-white/15"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
            <Store className="size-6 text-white/80" />
          </div>
          <div className="text-center">
            <h2 className="font-semibold text-white">Soy vendedor</h2>
            <p className="mt-1 text-xs text-white/60">Ya tengo credenciales BARAKA</p>
          </div>
          <span className="mt-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70 transition-colors group-hover:bg-white group-hover:text-brand-purple-dark">
            Acceder
          </span>
        </Link>
      </div>

      <p className="mt-8 text-center text-xs text-white/50">
        Quieres unirte como vendedor?{" "}
        <Link
          href="/"
          className="font-medium text-white/80 underline underline-offset-2 transition-colors hover:text-white"
        >
          Solicita tu acceso
        </Link>
      </p>
    </div>
  );
}
