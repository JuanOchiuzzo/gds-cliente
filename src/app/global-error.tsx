'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: '#0b0b0f',
            color: '#eee',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Algo deu errado
            </h1>
            <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>
              Nossa equipe foi notificada. Tente recarregar a página.
            </p>
            <button
              onClick={reset}
              style={{
                background: '#fff',
                color: '#000',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
