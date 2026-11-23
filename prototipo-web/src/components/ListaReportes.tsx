import TarjetaReporte, { CategoriaItem, ReporteProps } from "./TarjetaReporte";

const listaCategorias: CategoriaItem[] = [
  { id: 1, nombre: "Infraestructura / Baches" },
  { id: 2, nombre: "Infraestructura / Iluminación" },
  { id: 3, nombre: "Mantenimiento / Agua" },
  { id: 4, nombre: "Mobiliario / Aulas" },
];

const reportes: ReporteProps[] = [
  {
    id: 1,
    categoriaSeleccionada: "Infraestructura / Baches",
    categorias: listaCategorias,
    titulo: "Bache en acceso peatonal",
    descripcion:
      "Hay un bache frente al acceso norte. Dificulta el paso de estudiantes.",
    ubicacion: "Acceso norte, Campus Soyapango",
    tieneFoto: true,
  },
];

export default function ListaReportes() {
  return (
    <section className="flex justify-center">
      {reportes.map((reporte) => (
        <TarjetaReporte
          key={reporte.id}
          id={reporte.id}
          categoriaSeleccionada={reporte.categoriaSeleccionada}
          categorias={reporte.categorias}
          titulo={reporte.titulo}
          descripcion={reporte.descripcion}
          ubicacion={reporte.ubicacion}
          tieneFoto={reporte.tieneFoto}
        />
      ))}
    </section>
  );
}
