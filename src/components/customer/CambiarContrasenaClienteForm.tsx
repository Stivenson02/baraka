"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { brandAssets } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormState = "idle" | "loading" | "error" | "success";

const ERROR_MESSAGES: Record<string, string> = {
  PASSWORD_CONFIRMATION_MISMATCH: "Las contraseñas no coinciden.",
  PASSWORD_TOO_SHORT: "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.",
  PASSWORD_MISSING_UPPERCASE:
    "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.",
  PASSWORD_MISSING_NUMBER:
    "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.",
  CUSTOMER_PASSWORD_REUSED: "La nueva contraseña debe ser diferente a la temporal.",
  CUSTOMER_SESSION_EXPIRED: "Tu sesión expiró. Vuelve a iniciar sesión.",
  UNAUTHENTICATED: "Tu sesión expiró. Vuelve a iniciar sesión.",
};

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <li
      className={[
        "flex items-center gap-2 text-xs transition-colors",
        met ? "text-brand-purple-dark" : "text-brand-muted",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
          met ? "border-brand-purple-dark bg-brand-soft" : "border-black/15 bg-white",
        ].join(" ")}
      >
        <Check className={["size-3", met ? "opacity-100" : "opacity-0"].join(" ")} />
      </span>
      {label}
    </li>
  );
}

export function CambiarContrasenaClienteForm({ displayName }: { displayName: string }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/customer/change-password", {
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
        if (code === "CUSTOMER_SESSION_EXPIRED" || code === "UNAUTHENTICATED") {
          router.push("/login/cliente");
          return;
        }

        setErrorMessage(
          (code && ERROR_MESSAGES[code]) ||
            data?.error?.message ||
            "No pudimos actualizar la contraseña."
        );
        setState("error");
        return;
      }

      setState("success");
      setTimeout(() => {
        router.push("/cliente");
        router.refresh();
      }, 1000);
    } catch {
      setErrorMessage("No se pudo conectar. Inténtalo de nuevo.");
      setState("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-soft px-4 py-12">
      <div className="mb-8 relative h-12 w-36">
        <Image src={brandAssets.logo} alt="BARAKA" fill className="object-contain" />
      </div>

      <div className="w-full max-w-sm rounded-lg border border-black/5 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-soft">
            <ShieldCheck className="size-6 text-brand-purple-dark" />
          </div>
          <h1 className="mb-1 text-2xl font-bold text-brand-text">Crea tu contraseña</h1>
          <p className="text-sm leading-relaxed text-brand-muted">
            Hola, {displayName}. Cambia la contraseña temporal por una segura para tu cuenta.
          </p>
        </div>

        {state === "success" ? (
          <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-4 text-sm text-green-700">
            Contraseña guardada. Te estamos llevando a tu cuenta.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="mb-1.5 block text-sm font-medium text-brand-text"
              >
                Nueva contraseña
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={state === "loading"}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
                  aria-label={showNew ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <ul className="mt-3 grid gap-2 rounded-lg bg-brand-soft px-3 py-3">
                <RequirementItem met={hasMinLength} label="Mínimo 8 caracteres" />
                <RequirementItem met={hasUppercase} label="Al menos una mayúscula" />
                <RequirementItem met={hasLowercase} label="Al menos una minúscula" />
                <RequirementItem met={hasNumber} label="Al menos un número" />
              </ul>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-brand-text"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={state === "loading"}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
                  aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <ul className="mt-3 rounded-lg bg-brand-soft px-3 py-3">
                <RequirementItem
                  met={passwordsMatch}
                  label="Coincide con la contraseña escrita arriba"
                />
              </ul>
            </div>

            {state === "error" && errorMessage && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={state === "loading" || !isValid}
              className="w-full bg-brand-purple-dark text-white hover:bg-brand-purple disabled:opacity-50"
            >
              <ShieldCheck className="size-4" />
              Guardar contraseña
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
