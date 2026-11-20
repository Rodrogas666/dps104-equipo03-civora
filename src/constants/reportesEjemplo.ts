import type { ReporteVecinal } from '@/types/reportes';

export const REPORTES_EJEMPLO_RESIDENCIAL: ReporteVecinal[] = [
  {
    id: 'rep-001',
    categoria: 'bache',
    estado: 'en_proceso',
    titulo: 'Bache · Pasaje 5',
    ubicacion: 'Pasaje 5, Polígono C',
    fechaHora: '16 nov 2026 · 08:40',
    imagenUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=320&q=80',
  },
  {
    id: 'rep-002',
    categoria: 'basura',
    estado: 'pendiente',
    titulo: 'Basura · Pasaje 3',
    ubicacion: 'Pasaje 3, Polígono A',
    fechaHora: '16 nov 2026 · 08:40',
    imagenUrl:
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=320&q=80',
  },
  {
    id: 'rep-003',
    categoria: 'alumbrado',
    estado: 'resuelto',
    titulo: 'Alumbrado · Pasaje 2',
    ubicacion: 'Pasaje 2, Polígono B',
    fechaHora: '15 nov 2026 · 19:15',
    imagenUrl:
      'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=320&q=80',
  },
];
