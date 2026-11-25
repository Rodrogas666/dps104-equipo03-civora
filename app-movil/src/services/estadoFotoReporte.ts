type ListenerFoto = (url: string | null) => void;

// Sin foto al empezar: el usuario debe tomarla o elegirla (es obligatoria).
let fotoReporteActual: string | null = null;
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
