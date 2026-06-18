import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { brandAssets } from "@/lib/brand";
import { Button } from "@/components/ui/button";

export default function LoginClientePage() {
  return (
    <div className="min-h-screen bg-brand-soft flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 block">
        <div className="relative h-12 w-40">
          <Image src={brandAssets.logo} alt="BARAKA" fill className="object-contain" priority />
        </div>
      </Link>

      <div className="w-full max-w-sm bg-white rounded-2xl border border-black/5 p-8 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-brand-soft flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="size-7 text-brand-orange" />
        </div>
        <h1 className="text-xl font-semibold text-brand-text mb-2">Acceso de clientes</h1>
        <p className="text-sm text-brand-muted mb-6 leading-relaxed">
          Pronto podrás comprar en BARAKA con tu propia cuenta. Estamos preparando algo especial
          para ti.
        </p>
        <Button
          variant="outline"
          asChild
          className="w-full border-brand-purple/20 text-brand-purple-dark hover:bg-accent"
        >
          <Link href="/login">
            <ArrowLeft className="size-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
