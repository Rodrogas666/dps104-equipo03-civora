import type { CategoriaReporte, EstadoReporte } from '@/types/reportes';

export interface ResumenReporteEnviado {
  codigo: string;
  categoria: CategoriaReporte;
  titulo: string;
  ubicacion: string;
  fechaHora: string;
  estado: EstadoReporte;
}

type ListenerUbicacion = (ubicacion: string) => void;
type ListenerReporteEnviado = (reporte: ResumenReporteEnviado) => void;

let ubicacionActual = 'Pasaje 5, Polígono C';
let contadorReportes = 248;

let ultimoReporteEnviado: ResumenReporteEnviado = {
  codigo: 'REPORTE #0248',
  categoria: 'bache',
  titulo: 'Bache · Pasaje 5',
  ubicacion: 'Pasaje 5, Polígono C',
  fechaHora: '16 nov 2026 · 08:40',
  estado: 'pendiente',
};

const listenersUbicacion = new Set<ListenerUbicacion>();
const listenersReporteEnviado = new Set<ListenerReporteEnviado>();

const ETIQUETA_CATEGORIA: Record<CategoriaReporte, string> = {
  bache: 'Bache',
  basura: 'Basura',
  alumbrado: 'Alumbrado',
  otro: 'Otro',
};

export function obtenerUbicacionBorrador(): string {
  return ubicacionActual;
}

export function actualizarUbicacionBorrador(nuevaUbicacion: string): void {
  ubicacionActual = nuevaUbicacion;
  listenersUbicacion.forEach((listener) => listener(nuevaUbicacion));
}

export function suscribirUbicacionBorrador(listener: ListenerUbicacion): () => void {
  listenersUbicacion.add(listener);
  return () => {
    listenersUbicacion.delete(listener);
  };
}

export function obtenerUltimoReporteEnviado(): ResumenReporteEnviado {
  return ultimoReporteEnviado;
}

export function registrarReporteEnviado(
  categoria: CategoriaReporte,
  ubicacion: string
): ResumenReporteEnviado {
  const parteCorta = ubicacion.split(',')[0]?.trim() || 'Residencial';
  const codigo = `REPORTE #${String(contadorReportes).padStart(4, '0')}`;
  contadorReportes += 1;

  ultimoReporteEnviado = {
    codigo,
    categoria,
    titulo: `${ETIQUETA_CATEGORIA[categoria]} · ${parteCorta}`,
    ubicacion: ubicacion || 'Residencial Las Palmas',
    fechaHora: '16 nov 2026 · 08:40',
    estado: 'pendiente',
  };

  listenersReporteEnviado.forEach((listener) => listener(ultimoReporteEnviado));
  return ultimoReporteEnviado;
}

export function suscribirUltimoReporteEnviado(listener: ListenerReporteEnviado): () => void {
  listenersReporteEnviado.add(listener);
  return () => {
    listenersReporteEnviado.delete(listener);
  };
}
