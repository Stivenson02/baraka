"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  ShoppingBag,
  UserPlus,
} from "lucide-react";
import { brandAssets } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "login" | "register" | "reset";
type FormState = "idle" | "loading" | "error" | "success";

const ERROR_MESSAGES: Record<string, string> = {
  CUSTOMER_INVALID_CREDENTIALS: "Correo o contrasena incorrectos.",
  CUSTOMER_ACCOUNT_INACTIVE: "Tu cuenta de cliente esta inactiva. Contacta a BARAKA.",
  CUSTOMER_EMAIL_TAKEN: "Ya existe una cuenta con ese correo.",
  ECOMMERCE_INACTIVE: "El acceso de clientes aun no esta activo para este negocio.",
  VALIDATION_ERROR: "Verifica los datos ingresados.",
  INVALID_EMAIL: "Ingresa un correo valido.",
  LUKRAN_TIMEOUT: "El servidor tardo demasiado. Intentalo de nuevo.",
};

export function LoginClienteForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [state, setState] = useState<FormState>("idle");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setState("idle");
    setMessage("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage("");

    const endpoint =
      mode === "register"
        ? "/api/auth/customer/register"
        : mode === "reset"
          ? "/api/auth/customer/reset-password"
          : "/api/auth/customer/login";

    const payload =
      mode === "register"
        ? { name: form.name, email: form.email, phone: form.phone }
        : mode === "reset"
          ? { email: form.email }
          : { email: form.email, password: form.password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        success?: boolean;
        data?: {
          message?: string;
          customer?: { requiresPasswordChange?: boolean };
        };
        error?: { code?: string; message?: string };
      };

      if (!res.ok || !data.success) {
        const code = data?.error?.code;
        setMessage(
          (code && ERROR_MESSAGES[code]) ||
            data?.error?.message ||
            "No pudimos procesar la solicitud. Intentalo de nuevo."
        );
        setState("error");
        return;
      }

      if (mode === "login") {
        if (data.data?.customer?.requiresPasswordChange) {
          router.push("/login/cliente/cambiar-contrasena");
          return;
        }

        router.push("/cliente");
        router.refresh();
        return;
      }

      setState("success");
      setMessage(
        data.data?.message ||
          (mode === "reset"
            ? "Si el correo esta registrado, enviaremos una contrasena temporal."
            : "Cuenta creada. Revisa tu correo para encontrar la contrasena temporal.")
      );
    } catch {
      setMessage("No se pudo conectar. Verifica tu conexion e intentalo de nuevo.");
      setState("error");
    }
  }

  const title =
    mode === "register"
      ? "Crear cuenta"
      : mode === "reset"
        ? "Recuperar contrasena"
        : "Acceso de clientes";

  const description =
    mode === "register"
      ? "Crea tu cuenta y recibiras una contrasena temporal en tu correo."
      : mode === "reset"
        ? "Escribe tu correo y te enviaremos una nueva contrasena temporal si tu cuenta existe."
        : "Ingresa para comprar y gestionar tu cuenta BARAKA.";

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-[44%] shrink-0 flex-col justify-between bg-white px-12 py-12">
        <Link href="/" className="relative block h-10 w-32">
          <Image src={brandAssets.logoFull} alt="BARAKA" fill className="object-contain object-left" />
        </Link>

        <div>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-soft">
            <ShoppingBag className="size-7 text-brand-orange" />
          </div>
          <h1 className="mb-4 text-3xl font-bold leading-tight text-brand-text">
            Compra en BARAKA
            <br />
            con tu cuenta
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-brand-muted">
            Guarda tus datos, vuelve mas rapido al checkout y recupera tu acceso por correo cuando
            lo necesites.
          </p>
        </div>

        <p className="text-xs text-brand-muted">BARAKA Marketplace colombiano.</p>
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center justify-center bg-brand-soft px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="relative block h-12 w-36">
              <Image src={brandAssets.logo} alt="BARAKA" fill className="object-contain" />
            </Link>
          </div>

          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-brand-muted transition hover:text-brand-purple-dark"
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>

          <div className="rounded-lg border border-black/5 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="mb-1 text-2xl font-bold text-brand-text">{title}</h2>
              <p className="text-sm leading-relaxed text-brand-muted">{description}</p>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-1 rounded-lg bg-brand-soft p-1">
              {[
                { value: "login", label: "Entrar" },
                { value: "register", label: "Crear" },
                { value: "reset", label: "Recuperar" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => switchMode(item.value as Mode)}
                  className={[
                    "rounded-md px-2 py-2 text-xs font-medium transition",
                    mode === item.value
                      ? "bg-white text-brand-purple-dark shadow-sm"
                      : "text-brand-muted hover:text-brand-text",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {state === "success" && (
              <div className="mb-4 flex gap-2.5 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {state === "error" && message && (
              <div className="mb-4 flex gap-2.5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-brand-text">
                    Nombre completo
                  </label>
                  <Input
                    id="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    disabled={state === "loading"}
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-brand-text">
                  Correo
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="cliente@ejemplo.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  disabled={state === "loading"}
                  required
                />
              </div>

              {mode === "register" && (
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-brand-text">
                    Celular
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    disabled={state === "loading"}
                  />
                </div>
              )}

              {mode === "login" && (
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-brand-text"
                  >
                    Contrasena
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      disabled={state === "loading"}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
                      aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={state === "loading"}
                className="w-full bg-brand-purple-dark text-white hover:bg-brand-purple"
              >
                {state === "loading" ? (
                  <>
                    <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Procesando...
                  </>
                ) : mode === "register" ? (
                  <>
                    <UserPlus className="size-4" />
                    Crear cuenta
                  </>
                ) : mode === "reset" ? (
                  <>
                    <KeyRound className="size-4" />
                    Enviar recuperacion
                  </>
                ) : (
                  <>
                    <LogIn className="size-4" />
                    Ingresar
                  </>
                )}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-brand-muted">
            Si eres vendedor asociado, entra por{" "}
            <Link href="/login/vendedor" className="font-medium text-brand-purple-dark hover:underline">
              acceso de vendedores
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
