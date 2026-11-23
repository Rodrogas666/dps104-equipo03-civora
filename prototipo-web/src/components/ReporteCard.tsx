'use client';

import React, { useState } from 'react';
import { Reporte } from '../types/Reporte';

interface ReporteCardProps {
  reporte: Reporte;
}

const IMAGEN_FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='112' height='112' viewBox='0 0 112 112'><rect width='112' height='112' rx='12' fill='%23DCEBE1'/><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='bold' fill='%2317563A'>Campus</text></svg>";

export const ReporteCard: React.FC<ReporteCardProps> = ({ reporte }) => {
  const { titulo, ubicacion, tiempo, estado, categoria, imagenUrl } = reporte;
  const [imgSrc, setImgSrc] = useState(imagenUrl || IMAGEN_FALLBACK);

  const obtenerEstiloEstado = () => {
    if (estado === 'En proceso') {
      return { backgroundColor: '#FDE8CC', color: '#8A5300' };
    }
    if (estado === 'Recibido') {
      return { backgroundColor: '#E1EFE6', color: '#1B5E3A' };
    }
    return { backgroundColor: '#D4EDDA', color: '#155724' };
  };

  return (
    <article
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #d5e2d9',
        borderRadius: '16px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'row',
        gap: '1.1rem',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
    >
      <img
        src={imgSrc}
        alt={titulo}
        onError={() => setImgSrc(IMAGEN_FALLBACK)}
        style={{
          width: '112px',
          height: '112px',
          borderRadius: '12px',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span
            style={{
              ...obtenerEstiloEstado(),
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.22rem 0.65rem',
              borderRadius: '8px',
            }}
          >
            {estado}
          </span>
          <span
            style={{
              backgroundColor: '#eef2ef',
              color: '#3d4d44',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.22rem 0.65rem',
              borderRadius: '8px',
            }}
          >
            {categoria}
          </span>
        </div>
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#1c2822',
            margin: '0 0 0.35rem 0',
          }}
        >
          {titulo}
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#5c6b63', margin: 0 }}>
          {ubicacion} &middot; {tiempo}
        </p>
      </div>
    </article>
  );
};
