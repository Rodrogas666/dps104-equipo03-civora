"use client";

import ConfirmacionReporte from "./components/confirmarReporte";

export default function Home(): React.JSX.Element {

  const reporte = {
    numero: "REP-001",
    estado: "Recibido",
    tipo: "Infraestructura",
    titulo: "Bache en acceso peatonal",
    ubicacion: "Acceso norte - Campus Soyapango",
    fecha: "16 nov 2026 - 08:40"
  };

  const handleVolverInicio = (): void => {
    alert("Volviendo al inicio...");
  };

  const handleVerReporte = (): void => {
    alert("Consultando el reporte...");
  };

  return (
    <ConfirmacionReporte
      reporte={reporte}
      onVolverInicio={handleVolverInicio}
      onVerReporte={handleVerReporte}
    />
  );
}
