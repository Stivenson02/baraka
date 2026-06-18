import crypto from "crypto";
import { AppError } from "@/lib/errors/AppError";

const BASE_URL = process.env.URL_API_LK!;
const PUBLIC_KEY = process.env.LUKRAN_PUBLIC_KEY!;
const SECRET_KEY = process.env.LUKRAN_SECRET_KEY!;
const DEFAULT_TIMEOUT_MS = 4000;

function generateSignature(payload: string) {
  return crypto.createHmac("sha256", SECRET_KEY).update(payload).digest("hex");
}

export async function lukranFetch<T>({
  endpoint,
  method = "GET",
  body,
  clientIp,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  extraHeaders,
}: {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  clientIp?: string | null;
  timeoutMs?: number;
  extraHeaders?: Record<string, string>;
}): Promise<T> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyString = body ? JSON.stringify(body) : "";
  const payload = `${timestamp}.${bodyString}`;
  const signature = generateSignature(payload);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;

  try {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-lukran-public": PUBLIC_KEY,
        "x-lukran-timestamp": timestamp,
        "x-lukran-signature": signature,
        ...(clientIp ? { "x-lukran-client-ip": clientIp } : {}),
        ...(extraHeaders ?? {}),
      },
      body: method !== "GET" ? bodyString : undefined,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new AppError("Lukran no respondio a tiempo", 504, "LUKRAN_TIMEOUT");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }

  let data: unknown;

  try {
    data = await res.json();
  } catch {
    throw new AppError("Respuesta invalida del servidor", 500, "INVALID_JSON");
  }

  const parsed = data as {
    success?: boolean;
    error?: {
      message?: string;
      code?: string;
      details?: unknown;
    };
  };

  if (!res.ok || parsed.success === false) {
    throw new AppError(
      parsed?.error?.message || "Error en Lukran",
      res.status,
      parsed?.error?.code || "LUKRAN_ERROR",
      parsed?.error?.details
    );
  }

  return data as T;
}
