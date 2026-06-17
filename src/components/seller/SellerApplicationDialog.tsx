"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, Loader2, Users } from "lucide-react";
import Image from "next/image";

import { brandAssets } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TurnstileWidget from "@/components/seller/TurnstileWidget";
import { VALID_DOCUMENT_TYPES } from "@/services/seller-applications.service";

type FormState = "idle" | "submitting" | "success" | "error";

type FormFields = {
  firstName: string;
  lastName: string;
  middleName: string;
  secondLastName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  website: string;
};

const EMPTY_FORM: FormFields = {
  firstName: "",
  lastName: "",
  middleName: "",
  secondLastName: "",
  documentType: "CC",
  documentNumber: "",
  email: "",
  phone: "",
  address: "",
  website: "",
};

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function SellerApplicationDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState<FormFields>(EMPTY_FORM);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaStatus, setCaptchaStatus] = useState<"pending" | "verified" | "expired" | "error">("pending");
  const [intentToken, setIntentToken] = useState("");
  const formStartedAt = useRef(new Date().toISOString());

  useEffect(() => {
    fetch("/api/seller-applications/intent")
      .then((r) => r.json())
      .then((body: { success?: boolean; data?: { token?: string } }) => {
        if (body.success && body.data?.token) {
          setIntentToken(body.data.token);
        }
      })
      .catch(() => {});
  }, []);

  function handleDialogOpenChange(newOpen: boolean) {
    onOpenChange(newOpen);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!turnstileToken || captchaStatus !== "verified") {
      setErrorMsg("Por favor completa el captcha antes de enviar.");
      return;
    }

    setFormState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/seller-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          turnstileToken,
          intentToken,
          formStartedAt: formStartedAt.current,
        }),
      });

      const body = (await res.json()) as {
        success?: boolean;
        error?: { message?: string; code?: string };
      };

      if (!res.ok || !body.success) {
        const msg = body.error?.message ?? "Ocurrio un error. Intenta de nuevo.";
        setErrorMsg(msg);
        setFormState("error");
        return;
      }

      setFormState("success");
    } catch {
      setErrorMsg("Error de conexion. Verifica tu internet e intenta de nuevo.");
      setFormState("error");
    }
  }

  const isSubmitting = formState === "submitting";

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="mb-1 flex items-center gap-3">
            <div className="relative size-9 shrink-0">
              <Image src={brandAssets.isotipo} alt="" fill sizes="36px" className="object-contain" />
            </div>
            <div>
              <DialogTitle>Quiero vender con BARAKA</DialogTitle>
              <DialogDescription>
                Completa el formulario y el equipo BARAKA se pondrá en contacto contigo.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {formState === "success" ? (
          <div className="px-6 pb-8 pt-2 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-brand-purple/10">
              <CheckCircle className="size-7 text-brand-purple" />
            </div>
            <p className="text-base font-semibold text-brand-text">¡Solicitud enviada!</p>
            <p className="mt-2 text-sm text-brand-muted">
              Recibimos tu solicitud. El equipo BARAKA la revisará y te contactará pronto.
            </p>
            <Button
              type="button"
              className="mt-6 bg-brand-purple text-white hover:bg-brand-purple-hover"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 px-6 pb-2">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <label htmlFor="firstName" className="text-sm font-medium text-brand-text">
                    Nombre <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Ej. María"
                    required
                    disabled={isSubmitting}
                    autoComplete="given-name"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor="middleName" className="text-sm font-medium text-brand-text">
                    Segundo nombre
                  </label>
                  <Input
                    id="middleName"
                    name="middleName"
                    value={form.middleName}
                    onChange={handleChange}
                    placeholder="Opcional"
                    disabled={isSubmitting}
                    autoComplete="additional-name"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <label htmlFor="lastName" className="text-sm font-medium text-brand-text">
                    Apellido <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Ej. González"
                    required
                    disabled={isSubmitting}
                    autoComplete="family-name"
                  />
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor="secondLastName" className="text-sm font-medium text-brand-text">
                    Segundo apellido
                  </label>
                  <Input
                    id="secondLastName"
                    name="secondLastName"
                    value={form.secondLastName}
                    onChange={handleChange}
                    placeholder="Opcional"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <label htmlFor="documentType" className="text-sm font-medium text-brand-text">
                    Tipo de documento <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="documentType"
                    name="documentType"
                    value={form.documentType}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-brand-text outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {VALID_DOCUMENT_TYPES.map((dt) => (
                      <option key={dt} value={dt}>
                        {dt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor="documentNumber" className="text-sm font-medium text-brand-text">
                    Número de documento <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="documentNumber"
                    name="documentNumber"
                    value={form.documentNumber}
                    onChange={handleChange}
                    placeholder="Ej. 1234567890"
                    required
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-brand-text">
                  Correo electrónico <span className="text-destructive">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  required
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="phone" className="text-sm font-medium text-brand-text">
                  Celular <span className="text-destructive">*</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Ej. 3001234567"
                  required
                  disabled={isSubmitting}
                  autoComplete="tel"
                />
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="address" className="text-sm font-medium text-brand-text">
                  Dirección <span className="text-destructive">*</span>
                </label>
                <Input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Ej. Calle 45 # 12-34, Bogotá"
                  required
                  disabled={isSubmitting}
                  autoComplete="street-address"
                />
              </div>

              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                tabIndex={-1}
                aria-hidden="true"
                className="absolute left-[-9999px] opacity-0"
                autoComplete="off"
              />

              {siteKey && (
                <div className="mt-1">
                  <TurnstileWidget
                    siteKey={siteKey}
                    onVerify={(token) => {
                      setTurnstileToken(token);
                      setCaptchaStatus("verified");
                    }}
                    onExpire={() => {
                      setTurnstileToken("");
                      setCaptchaStatus("expired");
                    }}
                    onError={() => {
                      setTurnstileToken("");
                      setCaptchaStatus("error");
                    }}
                  />
                  {captchaStatus === "expired" && (
                    <p className="mt-1 text-center text-xs text-destructive">
                      El captcha expiró. Por favor recárgalo.
                    </p>
                  )}
                  {captchaStatus === "error" && (
                    <p className="mt-1 text-center text-xs text-destructive">
                      Error al cargar el captcha. Recarga la página.
                    </p>
                  )}
                </div>
              )}

              {errorMsg && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
                  <p className="text-sm text-destructive">{errorMsg}</p>
                </div>
              )}
            </div>

            <div className="px-6 pb-6 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || (!!siteKey && captchaStatus !== "verified")}
                className="w-full bg-brand-purple text-white hover:bg-brand-purple-hover disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Enviando solicitud...
                  </>
                ) : (
                  <>
                    <Users className="size-4" />
                    Enviar solicitud
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
