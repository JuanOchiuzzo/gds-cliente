'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { stands } from '@/lib/mock-data';

const createIcon = (color: string) =>
  L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};border:3px solid rgba(255,255,255,0.3);box-shadow:0 0 12px ${color}80;"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

export function StandMapInner() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-15.7801, -47.9292],
      zoom: 4,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    stands
      .filter((s) => s.status !== 'inativo')
      .forEach((stand) => {
        const percent = Math.round((stand.monthly_sales / stand.monthly_target) * 100);
        const color = percent >= 100 ? '#34d399' : percent >= 70 ? '#67e8f9' : '#f59e0b';
        const marker = L.marker([stand.lat, stand.lng], { icon: createIcon(color) }).addTo(map);
        marker.bindPopup(`
          <div style="color:#e4e4e7;font-size:12px;min-width:180px;">
            <p style="font-weight:bold;font-size:13px;color:#67e8f9;margin:0 0 4px">${stand.name}</p>
            <p style="margin:2px 0">${stand.city}, ${stand.state}</p>
            <p style="margin:2px 0">Vendas: ${stand.monthly_sales}/${stand.monthly_target} (${percent}%)</p>
            <p style="margin:2px 0">Unidades: ${stand.sold_units}/${stand.total_units} vendidas</p>
            <p style="margin:2px 0">Gerente: ${stand.manager_name}</p>
          </div>
        `);
      });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full rounded-b-3xl" />;
}
