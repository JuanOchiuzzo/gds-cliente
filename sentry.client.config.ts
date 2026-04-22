// Sentry client-side init. Só ativa se NEXT_PUBLIC_SENTRY_DSN estiver definido.
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    // PII: não enviamos dados sensíveis por padrão (LGPD)
    sendDefaultPii: false,
    integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })],
  });
}
