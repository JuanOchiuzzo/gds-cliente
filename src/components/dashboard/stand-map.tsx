'use client';

import { useEffect, useState } from 'react';

// This component is no longer used in production pages
// Map functionality can be added back when needed with real stand data
export function StandMap() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[var(--sf-surface)] rounded-b-3xl">
      <p className="text-sm text-[var(--sf-text-muted)]">Mapa disponível em breve</p>
    </div>
  );
}
