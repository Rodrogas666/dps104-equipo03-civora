import React from 'react';
import { Reporte } from '../types/Reporte';
import styles from './ReporteCard.module.css';

interface ReporteCardProps {
  reporte: Reporte;
}

export const ReporteCard: React.FC<ReporteCardProps> = ({ reporte }) => {
  const { titulo, ubicacion, tiempo, estado, categoria, imagenUrl } = reporte;

  // Renderizado condicional según el estado del reporte (Rúbrica B2)
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
    <article className={styles.card}>
      <img src={imagenUrl} alt={titulo} className={styles.imagen} />
      <div className={styles.info}>
        <div className={styles.badges}>
          <span className={styles.badgeEstado} style={obtenerEstiloEstado()}>
            {estado}
          </span>
          <span className={styles.badgeCategoria}>{categoria}</span>
        </div>
        <h3 className={styles.titulo}>{titulo}</h3>
        <p className={styles.meta}>
          {ubicacion} &middot; {tiempo}
        </p>
      </div>
    </article>
  );
};