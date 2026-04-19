'use client';

import { useEffect, useState } from 'react';
import { stands } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

// Dynamic import for leaflet (SSR-safe)
export function StandMap() {
  const [MapComponent, setMapComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Dynamically import leaflet components only on client
    import('./stand-map-inner').then((mod) => {
      setMapComponent(() => mod.StandMapInner);
    });
  }, []);

  if (!MapComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950/40 rounded-b-3xl">
        <div className="text-sm text-zinc-600">Carregando mapa...</div>
      </div>
    );
  }

  return <MapComponent />;
}
