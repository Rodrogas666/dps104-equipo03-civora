import { REPORTES_EJEMPLO_RESIDENCIAL } from '@/constants/reportesEjemplo';

type ListenerFoto = (url: string | null) => void;

let fotoReporteActual: string | null = REPORTES_EJEMPLO_RESIDENCIAL[0]?.imagenUrl ?? null;
const listeners = new Set<ListenerFoto>();

export function obtenerFotoReporteActual(): string | null {
  return fotoReporteActual;
}

export function actualizarFotoReporte(nuevaUrl: string | null): void {
  fotoReporteActual = nuevaUrl;
  listeners.forEach((listener) => listener(nuevaUrl));
}

export function suscribirFotoReporte(listener: ListenerFoto): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
