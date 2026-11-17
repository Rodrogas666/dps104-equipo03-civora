import ListaReportes from "@/components/ListaReportes";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900 px-4 py-10">
      <h1 className="mb-6 text-center text-lg font-bold text-white">
        Prototipo Web — Reportes del Campus
      </h1>
      <ListaReportes />
    </main>
  );
}
