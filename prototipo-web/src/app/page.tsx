import ListaReportes from "@/components/ListaReportes";
import { ReporteCard } from "@/components/ReporteCard";
import { Reporte } from "@/types/Reporte";

const REPORTES: Reporte[] = [
  {
    id: 101,
    titulo: "Bache en acceso peatonal",
    ubicacion: "Acceso norte",
    tiempo: "Hace 2 h",
    estado: "En proceso",
    categoria: "Baches",
    imagenUrl: "",
  },
  {
    id: 102,
    titulo: "Basura junto a cafetería",
    ubicacion: "Cafetería",
    tiempo: "Hace 35 min",
    estado: "Recibido",
    categoria: "Limpieza",
    imagenUrl: "",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f8f6] px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-emerald-950">
            Prototipo de Reportes — Campus Soyapango
          </h1>
        </header>

        {/* Vista de Nuevo Reporte (Rama MV242667) */}
        <ListaReportes />

        {/* Vista de Tarjetas de Reporte (Rama PA242675) */}
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {REPORTES.map((reporte) => (
            <ReporteCard key={reporte.id} reporte={reporte} />
          ))}
        </section>
      </div>
    </main>
  );
}
