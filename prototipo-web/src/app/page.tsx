import { ReporteCard } from '../components/ReporteCard';
import { Reporte } from '../types/Reporte';

const REPORTE_1: Reporte = {
  id: 101,
  titulo: 'Bache en acceso peatonal',
  ubicacion: 'Acceso norte',
  tiempo: 'Hace 2 h',
  estado: 'En proceso',
  categoria: 'Baches',
  imagenUrl: '',
};

const REPORTE_2: Reporte = {
  id: 102,
  titulo: 'Basura junto a cafetería',
  ubicacion: 'Cafetería',
  tiempo: 'Hace 35 min',
  estado: 'Recibido',
  categoria: 'Limpieza',
  imagenUrl: '',
};

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#f6f8f6',
        padding: '3rem 2rem',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.25rem',
        }}
      >
        <ReporteCard reporte={REPORTE_1} />
        <ReporteCard reporte={REPORTE_2} />
      </div>
    </main>
  );
}