import crypto from "crypto";

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3003",
];
const TOKEN_TTL_SECONDS = 600;

type IntentPayload = {
  iat: number;
  exp: number;
  nonce: string;
  path: string;
};

function getContactFormSecret() {
  return process.env.CONTACT_FORM_SECRET;
}

export function getAllowedContactOrigins() {
  const envOrigins = process.env.CONTACT_FORM_ALLOWED_ORIGINS;

  if (!envOrigins) {
    return DEFAULT_ALLOWED_ORIGINS;
  }

  return envOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function stableStringify(value: IntentPayload) {
  return JSON.stringify({
    iat: value.iat,
    exp: value.exp,
    nonce: value.nonce,
    path: value.path,
  });
}

function sign(value: string) {
  const secret = getContactFormSecret();

  if (!secret) {
    throw new Error("CONTACT_FORM_SECRET is not configured");
  }

  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function getSafeRequestOrigin(headers: Headers) {
  return headers.get("origin") ?? headers.get("referer") ?? null;
}

export function isAllowedContactOrigin(headers: Headers) {
  const origin = getSafeRequestOrigin(headers);

  if (!origin) {
    return false;
  }

  try {
    const parsed = new URL(origin);
    return getAllowedContactOrigins().includes(parsed.origin);
  } catch {
    return false;
  }
}

export function isAllowedContactOriginIfPresent(headers: Headers) {
  const origin = getSafeRequestOrigin(headers);

  if (!origin) {
    return true;
  }

  return isAllowedContactOrigin(headers);
}

export function isLikelyBotSubmission(body: {
  website?: string | null;
  formStartedAt?: string | null;
}) {
  if (body.website && body.website.trim().length > 0) {
    return true;
  }

  if (!body.formStartedAt) {
    return true;
  }

  const startedAt = Date.parse(body.formStartedAt);

  if (Number.isNaN(startedAt)) {
    return true;
  }

  return Date.now() - startedAt < 2500;
}

export function issueSellerIntentToken(path: string) {
  const now = Math.floor(Date.now() / 1000);
  const payload: IntentPayload = {
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
    nonce: crypto.randomUUID(),
    path,
  };

  const body = stableStringify(payload);
  const signature = sign(body);

  return `${Buffer.from(body, "utf8").toString("base64url")}.${signature}`;
}

export function verifySellerIntentToken(token: string, path: string) {
  const secret = getContactFormSecret();

  if (!secret) {
    throw new Error("CONTACT_FORM_SECRET is not configured");
  }

  const dotIndex = token.indexOf(".");

  if (dotIndex === -1) {
    return false;
  }

  const encodedPayload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  if (!encodedPayload || !signature) {
    return false;
  }

  let decoded: string;

  try {
    decoded = Buffer.from(encodedPayload, "base64url").toString("utf8");
  } catch {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(decoded).digest("hex");

  if (expected !== signature) {
    return false;
  }

  let payload: IntentPayload;

  try {
    payload = JSON.parse(decoded) as IntentPayload;
  } catch {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);

  return (
    payload.path === path &&
    payload.iat <= now &&
    payload.exp >= now
  );
}

export const issuePublicFormIntentToken = issueSellerIntentToken;
export const verifyPublicFormIntentToken = verifySellerIntentToken;
