"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { brandAssets } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormState = "idle" | "loading" | "error" | "success";

const ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: "Verifica los datos ingresados.",
  INVALID_CURRENT_PASSWORD: "La contraseña temporal es incorrecta.",
  PASSWORD_CONFIRMATION_MISMATCH: "Las contraseñas nuevas no coinciden.",
  PASSWORD_TOO_SHORT: "La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.",
  PASSWORD_MISSING_UPPERCASE: "La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.",
  PASSWORD_MISSING_NUMBER: "La nueva contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.",
  PASSWORD_REUSED: "La nueva contraseña debe ser diferente a la temporal.",
  EXTERNAL_SESSION_EXPIRED: "Tu sesión expiró. Vuelve a iniciar sesión.",
  UNAUTHENTICATED: "Tu sesión expiró. Vuelve a iniciar sesión.",
  LUKRAN_TIMEOUT: "El servidor tardó demasiado. Inténtalo de nuevo.",
};

export function CambiarContrasenaForm({ displayName }: { displayName: string }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isLongEnough = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isValid = isLongEnough && hasUppercase && hasNumber && passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/seller/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: { code?: string; message?: string };
      };

      if (!res.ok || !data.success) {
        const code = data?.error?.code;
        if (code === "EXTERNAL_SESSION_EXPIRED" || code === "UNAUTHENTICATED") {
          router.push("/login/vendedor?reason=expired");
          return;
        }
        setErrorMessage(
          (code && ERROR_MESSAGES[code]) ||
            data?.error?.message ||
            "Error al cambiar la contraseña. Inténtalo de nuevo."
        );
        setState("error");
        return;
      }

      setState("success");
      setTimeout(() => {
        router.push("/vendedor");
        router.refresh();
      }, 1200);
    } catch {
      setErrorMessage("No se pudo conectar. Verifica tu conexión e inténtalo de nuevo.");
      setState("error");
    }
  }

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
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
            <KeyRound className="size-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold leading-tight mb-4">
            Crea tu
            <br />
            contraseña
          </h1>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Hola, <span className="text-white font-medium">{displayName}</span>. Antes de acceder
            a tu panel, establece una contraseña segura para tu cuenta BARAKA.
          </p>
          <div className="flex items-start gap-3 text-sm text-white/70">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="size-4" />
            </div>
            <p>Esta contraseña reemplaza la temporal enviada por BARAKA. Solo la sabrás tú.</p>
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

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-brand-text mb-1">Establece tu contraseña</h2>
            <p className="text-sm text-brand-muted">
              Crea una contraseña segura para acceder a tu panel. Debe ser diferente a la temporal.
            </p>
          </div>

          {state === "success" ? (
            <div className="rounded-xl bg-green-50 border border-green-100 px-5 py-5 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="size-6 text-green-600" />
              </div>
              <p className="font-semibold text-green-800 mb-1">¡Contraseña guardada!</p>
              <p className="text-sm text-green-700">Redirigiendo a tu dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-brand-text mb-1.5"
                >
                  Nueva contraseña
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Mín. 8 caracteres, 1 mayúscula y 1 número"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={state === "loading"}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
                    tabIndex={-1}
                    aria-label={showNew ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {newPassword.length > 0 && (!isLongEnough || !hasUppercase || !hasNumber) && (
                  <p className="text-xs text-red-500 mt-1">
                    Mínimo 8 caracteres, una mayúscula y un número
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-brand-text mb-1.5"
                >
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repite tu nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={state === "loading"}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
                    tabIndex={-1}
                    aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
                )}
              </div>

              {state === "error" && errorMessage && (
                <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={state === "loading" || !isValid}
                className="w-full bg-brand-purple-dark text-white hover:bg-brand-purple disabled:opacity-50"
              >
                {state === "loading" ? (
                  <>
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="size-4" />
                    Guardar contraseña
                  </>
                )}
              </Button>
            </form>
          )}

          <p className="mt-6 text-xs text-brand-muted text-center">
            ¿Problemas para acceder?{" "}
            <Link href="/" className="text-brand-purple-dark hover:underline font-medium">
              Contacta soporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
