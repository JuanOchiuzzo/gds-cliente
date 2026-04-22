/**
 * Rate limiter client-side (token bucket simples em memória).
 * NÃO substitui rate limiting server-side (Vercel/Cloudflare/nginx),
 * mas previne spam acidental de cliques e loops de fetch.
 */

type Bucket = {
  tokens: number;
  lastRefill: number;
};

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Máximo de ações permitidas na janela */
  max: number;
  /** Janela em milissegundos */
  windowMs: number;
}

/**
 * Tenta consumir um token do bucket identificado por `key`.
 * Retorna `true` se a ação pode prosseguir, `false` se excedeu.
 */
export function tryConsume(key: string, opts: RateLimitOptions): boolean {
  const now = Date.now();
  const refillRate = opts.max / opts.windowMs; // tokens/ms
  const bucket = buckets.get(key) ?? { tokens: opts.max, lastRefill: now };

  const elapsed = now - bucket.lastRefill;
  bucket.tokens = Math.min(opts.max, bucket.tokens + elapsed * refillRate);
  bucket.lastRefill = now;

  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return true;
}

/** Presets comuns. */
export const RATE_LIMITS = {
  /** Criação de lead: 10 por minuto por usuário */
  createLead: { max: 10, windowMs: 60_000 },
  /** Envio de mensagem no chat: 30 por minuto */
  sendMessage: { max: 30, windowMs: 60_000 },
  /** Mutations genéricas: 60 por minuto */
  mutation: { max: 60, windowMs: 60_000 },
  /** Login attempts: 5 por 15 min */
  auth: { max: 5, windowMs: 15 * 60_000 },
} as const;

/**
 * Wrapper que lança Error se exceder limite.
 */
export function enforceRateLimit(key: string, opts: RateLimitOptions): void {
  if (!tryConsume(key, opts)) {
    throw new Error(
      `Muitas tentativas em pouco tempo. Aguarde um momento e tente novamente.`
    );
  }
}
