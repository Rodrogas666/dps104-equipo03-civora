export type CategoriaReporte = 'bache' | 'basura' | 'alumbrado' | 'otro';

export type EstadoReporte = 'pendiente' | 'en_proceso' | 'resuelto';

export type FiltroEstadoReporte = 'todos' | EstadoReporte;

export type PestanaInferiorCivora = 'inicio' | 'reportar' | 'mis_reportes';

export interface ReporteVecinal {
  id: string;
  categoria: CategoriaReporte;
  estado: EstadoReporte;
  titulo: string;
  ubicacion: string;
  fechaHora: string;
  imagenUrl: string;
}

export interface DatosNuevoReporte {
  fotoUrl: string | null;
  categoria: CategoriaReporte;
  ubicacion: string;
  descripcion: string;
}
