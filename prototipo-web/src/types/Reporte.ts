export type EstadoReporte = 'En proceso' | 'Recibido' | 'Resuelto';
export type CategoriaReporte = 'Baches' | 'Limpieza' | 'Otros';

export interface Reporte {
  id: number;
  titulo: string;
  ubicacion: string;
  tiempo: string;
  estado: EstadoReporte;
  categoria: CategoriaReporte;
  imagenUrl: string;
}