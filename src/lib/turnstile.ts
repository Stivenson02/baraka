import { AppError } from "@/lib/errors/AppError";

export async function verifyTurnstileToken(token: string, remoteIp?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    throw new AppError("Turnstile no configurado", 500, "TURNSTILE_NOT_CONFIGURED");
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  if (remoteIp) {
    formData.append("remoteip", remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as {
    success?: boolean;
    "error-codes"?: string[];
  };

  if (!response.ok || !data.success) {
    throw new AppError("Validacion captcha fallida", 400, "TURNSTILE_INVALID", {
      provider: "cloudflare_turnstile",
      errorCodes: data["error-codes"] ?? [],
    });
  }
}
