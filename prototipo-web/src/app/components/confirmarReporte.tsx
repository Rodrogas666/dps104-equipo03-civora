"use client";
import "./ConfirmacionReporte.css";

// Componente que confirma el envío de un reporte.
interface Reporte {
  numero: string;
  estado: string;
  tipo: string;
  titulo: string;
  ubicacion: string;
  fecha: string;
}

interface ConfirmacionReporteProps {
  reporte: Reporte;
  onVolverInicio: () => void;
  onVerReporte: () => void;
}

function ConfirmacionReporte({
  reporte,
  onVolverInicio,
  onVerReporte
}: ConfirmacionReporteProps): React.JSX.Element {
  return (
    <main className="confirmacion-container">


      {/* Encabezado de confirmación */}
      <header className="confirmacion-header">
        <span className="icono-regresar">‹</span>
        <h2>Confirmación</h2>
      </header>


      <section className="confirmacion-contenido">


        {/* Indicador de envío exitoso */}
        <div className="icono-exito">
          <span>✓</span>
        </div>


        <h1>¡Gracias por reportar!</h1>


        <p className="mensaje-confirmacion">
          Tu reporte ya está registrado.
          <br />
          Puedes consultar su avance en Mis reportes.
        </p>


        {/* Información dinámica del reporte enviado */}
        <article className="detalle-reporte">


          <div className="reporte-encabezado">
            <span>REPORTE #{reporte.numero}</span>


            <span className="estado-reporte">
              {reporte.estado}
            </span>
          </div>


          {/* Tipo de problema seleccionado por el usuario */}
          <p className="tipo-reporte">
            Tipo: {reporte.tipo}
          </p>


          <h3>{reporte.titulo}</h3>


          <p className="reporte-ubicacion">
            {reporte.ubicacion}
          </p>


          <p className="reporte-fecha">
            {reporte.fecha}
          </p>


        </article>


        {/* Información sobre el seguimiento */}
        <article className="siguiente-paso">
          <h3>¿Qué sigue?</h3>


          <p>
            El equipo de mantenimiento revisará tu reporte
            y actualizará su estado.
          </p>
        </article>


        {/* Regresar a la pantalla principal */}
        <button
          className="boton-inicio"
          onClick={onVolverInicio}
        >
          Volver al inicio
        </button>


      </section>


      {/* Consultar el reporte enviado */}
      <footer className="confirmacion-footer">
        <button
          className="boton-ver-reporte"
          onClick={onVerReporte}
        >
          Ver mi reporte
        </button>
      </footer>


    </main>
  );
}


export default ConfirmacionReporte;