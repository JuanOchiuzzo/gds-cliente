'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          background: '#06070b',
          color: '#f3f5fb',
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: '24px',
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <div
            style={{
              margin: '0 auto 20px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 18,
              background: 'rgba(255,99,122,0.12)',
              color: '#ff637a',
              border: '1px solid rgba(255,99,122,0.3)',
            }}
          >
            <AlertTriangle width={24} height={24} />
          </div>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>Algo derreteu na forja</h1>
          <p style={{ color: '#8d93a3', fontSize: 14, marginBottom: 24 }}>
            Nossos engenheiros foram notificados. Tente novamente em instantes.
          </p>
          <button
            onClick={reset}
            style={{
              background:
                'linear-gradient(135deg,#9d8cff,#5a46e0 55%,#4638b8)',
              color: '#fff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: 14,
              fontSize: 14,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <RotateCw width={16} height={16} />
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
