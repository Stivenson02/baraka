"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, LoaderCircle, Mail, Megaphone } from "lucide-react";

import TurnstileWidget from "@/components/seller/TurnstileWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const INITIAL_FORM = {
  name: "",
  phone: "",
  email: "",
  website: "",
};

export function NewsletterSignupForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [formStartedAt, setFormStartedAt] = useState(() => new Date().toISOString());
  const [intentToken, setIntentToken] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    kind: "idle" | "success" | "error";
    message: string;
  }>({ kind: "idle", message: "" });
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const canSubmit =
    form.name.trim().length >= 2 &&
    form.phone.trim().length >= 7 &&
    form.email.trim().length >= 5 &&
    Boolean(turnstileToken);

  useEffect(() => {
    fetch("/api/newsletter/intent")
      .then((response) => response.json())
      .then((json) => {
        if (json?.success && typeof json?.data?.token === "string") {
          setIntentToken(json.data.token);
        }
      })
      .catch(() => undefined);
  }, []);

  function updateField(field: keyof typeof INITIAL_FORM, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.website.trim()) {
      setStatus({ kind: "error", message: "No pudimos procesar la solicitud." });
      return;
    }

    if (!turnstileToken) {
      setStatus({ kind: "error", message: "Completa la verificacion para continuar." });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ kind: "idle", message: "" });

      const token =
        intentToken ||
        (await fetch("/api/newsletter/intent")
          .then((response) => response.json())
          .then((json) => json.data.token));

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          formStartedAt,
          intentToken: token,
          turnstileToken,
        }),
      });
      const json = await response.json();

      if (!response.ok || !json?.success) {
        throw new Error(json?.error?.message ?? "No pudimos guardar tus datos.");
      }

      setStatus({
        kind: "success",
        message: "Listo, te tendremos presente para promociones, descuentos y novedades.",
      });
      setForm(INITIAL_FORM);
      setFormStartedAt(new Date().toISOString());
      setTurnstileToken("");
      setIntentToken("");
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "No pudimos guardar tus datos.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-orange">Promociones BARAKA</p>
          <h2 className="mt-1 text-2xl font-bold text-brand-text">
            Recibe descuentos y novedades
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">
            Dejanos tus datos y te avisamos cuando tengamos ofertas, beneficios para clientes
            registrados y promociones especiales.
          </p>
        </div>
        <div className="hidden size-10 items-center justify-center rounded-lg bg-brand-soft text-brand-purple-dark sm:flex">
          <Megaphone className="size-5" />
        </div>
      </div>

      <form className="mt-5 grid gap-3 md:grid-cols-3" onSubmit={handleSubmit}>
        <label className="grid gap-1.5 text-sm font-medium text-brand-text">
          Nombre
          <Input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Tu nombre"
            className="h-10 bg-white"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-brand-text">
          Telefono
          <Input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="300 000 0000"
            className="h-10 bg-white"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-brand-text">
          Correo
          <Input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="correo@ejemplo.com"
            className="h-10 bg-white"
          />
        </label>

        <input
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
          className="sr-only"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <input type="hidden" value={formStartedAt} readOnly />

        <div className="md:col-span-3">
          {turnstileSiteKey ? (
            <TurnstileWidget
              siteKey={turnstileSiteKey}
              onVerify={setTurnstileToken}
              onExpire={() => setTurnstileToken("")}
              onError={() => setTurnstileToken("")}
            />
          ) : (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Falta configurar Turnstile para activar este formulario.
            </p>
          )}
        </div>

        {status.message && (
          <div
            className={`md:col-span-3 rounded-lg px-3 py-2 text-sm ${
              status.kind === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {status.kind === "success" ? (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                {status.message}
              </span>
            ) : (
              status.message
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting || !canSubmit}
          className="md:col-span-3 bg-brand-purple text-white hover:bg-brand-purple-hover"
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle className="size-4 animate-spin" />
              Guardando
            </span>
          ) : (
            <>
              <Mail className="size-4" />
              Quiero recibir promociones
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
