// =========================================================================
// Mémoire Vive — Logique de Sécurité & Authentification Admin
// =========================================================================

export const ADMIN_COOKIE_NAME = "mv_admin_session";

// Secret par défaut si non fourni dans l'environnement
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "mv_session_secret_2026_ouagadougou_burkina_key";

export const DEFAULT_ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "wendclasss@gmail.com";
export const DEFAULT_ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "MemoireVive2026!Securise";

// -------------------------------------------------------------------------
// Helpers Base64URL 100% compatibles Edge Runtime, Node.js & Navigateur
// (Sans aucune dépendance envers Buffer qui peut planter le Middleware Next.js)
// -------------------------------------------------------------------------
function stringToBase64Url(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToString(base64url: string): string {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToArrayBuffer(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// -------------------------------------------------------------------------
// Rate Limiter en mémoire (Protection Anti-Brute Force : 5 tentatives / 10 min)
// -------------------------------------------------------------------------
interface RateLimitEntry {
  attempts: number;
  resetAt: number;
  blockedUntil?: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes de blocage

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Vérifier si l'IP est bloquée
  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: retryAfter,
    };
  }

  // Réinitialiser la fenêtre si expirée
  if (now > record.resetAt) {
    rateLimitMap.delete(ip);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: Math.ceil(BLOCK_DURATION_MS / 1000),
    };
  }

  return {
    allowed: true,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.attempts),
  };
}

export function recordFailedAttempt(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  let record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    record = {
      attempts: 1,
      resetAt: now + WINDOW_MS,
    };
  } else {
    record.attempts += 1;
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
  }

  rateLimitMap.set(ip, record);
  return checkRateLimit(ip);
}

export function clearRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}

// -------------------------------------------------------------------------
// Signatures de Tokens Cryptographiques (Web Crypto API standard)
// -------------------------------------------------------------------------
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createAdminSessionToken(email: string): Promise<string> {
  const payload = {
    email: email.trim().toLowerCase(),
    role: "admin",
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 jours de validité
  };

  const payloadStr = JSON.stringify(payload);
  const payloadB64 = stringToBase64Url(payloadStr);

  const key = await getCryptoKey(SESSION_SECRET);
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(payloadB64)
  );

  const signatureB64 = arrayBufferToBase64Url(signatureBuffer);
  return `${payloadB64}.${signatureB64}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null
): Promise<{ valid: boolean; email?: string }> {
  if (!token) return { valid: false };

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return { valid: false };

    const [payloadB64, signatureB64] = parts;
    const key = await getCryptoKey(SESSION_SECRET);
    const enc = new TextEncoder();

    const signatureBytes = base64UrlToArrayBuffer(signatureB64);
    const isSignatureValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as BufferSource,
      enc.encode(payloadB64)
    );

    if (!isSignatureValid) return { valid: false };

    const payloadJson = base64UrlToString(payloadB64);
    const payload = JSON.parse(payloadJson);

    if (payload.exp && Date.now() > payload.exp) {
      return { valid: false };
    }

    const expectedAdminEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL)
      .trim()
      .toLowerCase();

    if (payload.email !== expectedAdminEmail) {
      return { valid: false };
    }

    return { valid: true, email: payload.email };
  } catch (err) {
    console.error("Erreur vérification token admin:", err);
    return { valid: false };
  }
}
