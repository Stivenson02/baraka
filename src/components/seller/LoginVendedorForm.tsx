"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff, LogIn, ShieldCheck, Store } from "lucide-react";
import { brandAssets } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormState = "idle" | "loading" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_EXTERNAL_CREDENTIALS:
    "Credenciales incorrectas. Verifica tu correo o usuario y contraseña.",
  EXTERNAL_ACCESS_DENIED:
    "Tu acceso a BARAKA ha sido desactivado. Contáctate con soporte.",
  EXTERNAL_SESSION_EXPIRED: "Tu sesión ha expirado. Vuelve a ingresar.",
  VALIDATION_ERROR: "Verifica los datos ingresados.",
  LUKRAN_TIMEOUT: "El servidor tardó demasiado. Inténtalo de nuevo.",
};

interface Props {
  reason?: string;
  logout?: string;
}

export function LoginVendedorForm({ reason, logout }: Props) {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/seller/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        data?: { user?: { mustChangePassword?: boolean } };
        error?: { code?: string; message?: string };
      };

      if (!res.ok || !data.success) {
        const code = data?.error?.code;
        setErrorMessage(
          (code && ERROR_MESSAGES[code]) ||
            data?.error?.message ||
            "Error al iniciar sesión. Inténtalo de nuevo."
        );
        setState("error");
        return;
      }

      if (data.data?.user?.mustChangePassword) {
        router.push("/login/vendedor/cambiar-contrasena");
        return;
      }

      router.push("/vendedor");
      router.refresh();
    } catch {
      setErrorMessage("No se pudo conectar. Verifica tu conexión e inténtalo de nuevo.");
      setState("error");
    }
  }

  const infoMessage =
    logout === "1"
      ? { type: "success" as const, text: "Sesión cerrada correctamente." }
      : reason === "expired"
        ? { type: "warning" as const, text: "Tu sesión expiró. Vuelve a ingresar." }
        : null;

  return (
    <div className="min-h-screen flex">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] bg-[#4B1677] px-12 py-12 text-white shrink-0">
        <div className="relative h-10 w-32">
          <Image
            src={brandAssets.logoFull}
            alt="BARAKA"
            fill
            className="object-contain object-left brightness-0 invert"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold leading-tight mb-4">
            Panel de vendedor
            <br />
            BARAKA
          </h1>
          <p className="text-white/70 text-sm leading-relaxed mb-8">
            Ingresa con las credenciales que recibiste después de ser aprobado como vendedor
            BARAKA.
          </p>
          <div className="space-y-3">
            {[
              { icon: ShieldCheck, text: "Acceso seguro con sesión cifrada" },
              { icon: Store, text: "Red de vendedores asociados BARAKA" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-white/75">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Icon className="size-4" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/40">© 2026 BARAKA. Marketplace colombiano.</p>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-12 bg-white min-w-0">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="relative h-12 w-36">
              <Image src={brandAssets.logo} alt="BARAKA" fill className="object-contain" />
            </div>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-purple-dark mb-6 transition"
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>

          <h2 className="text-2xl font-bold text-brand-text mb-1">Iniciar sesión</h2>
          <p className="text-sm text-brand-muted mb-1">Acceso para vendedores asociados BARAKA.</p>
          <p className="text-xs text-brand-muted/70 mb-5">
            Este acceso es para vendedores. Si quieres comprar, usa el acceso de clientes.
          </p>
          <p className="text-xs text-brand-muted/80 mb-5 rounded-lg bg-brand-soft px-3 py-2">
            Olvidaste tu contrasena de vendedor? Por ahora comunicate con el administrador de
            BARAKA para recuperar tu acceso.
            {/* TODO: Reemplazar este mensaje por el WhatsApp/contacto oficial del administrador. */}
          </p>

          {infoMessage && (
            <div
              className={[
                "flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm mb-4",
                infoMessage.type === "success"
                  ? "bg-green-50 border border-green-100 text-green-700"
                  : "bg-amber-50 border border-amber-100 text-amber-700",
              ].join(" ")}
            >
              {infoMessage.type === "success" ? (
                <CheckCircle2 className="size-4 shrink-0" />
              ) : (
                <AlertCircle className="size-4 shrink-0" />
              )}
              {infoMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-brand-text mb-1.5">
                Correo o usuario
              </label>
              <Input
                id="login"
                type="text"
                autoComplete="username"
                placeholder="vendedor@ejemplo.com"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                disabled={state === "loading"}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brand-text mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={state === "loading"}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {state === "error" && errorMessage && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={state === "loading"}
              className="w-full bg-brand-purple-dark text-white hover:bg-brand-purple"
            >
              {state === "loading" ? (
                <>
                  <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  Ingresar
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-xs text-brand-muted text-center">
            ¿Quieres ser vendedor BARAKA?{" "}
            <Link href="/" className="text-brand-purple-dark hover:underline font-medium">
              Solicita tu acceso
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
