export interface CategoriaItem {
  id: number;
  nombre: string;
}

export interface ReporteProps {
  id: number;
  categoriaSeleccionada: string;
  categorias: CategoriaItem[];
  titulo: string;
  descripcion: string;
  ubicacion: string;
  tieneFoto: boolean;
}

export default function TarjetaReporte({
  categoriaSeleccionada,
  categorias,
  titulo,
  descripcion,
  ubicacion,
  tieneFoto,
}: ReporteProps) {
  return (
    <article className="w-full max-w-sm rounded-3xl border border-emerald-900/10 bg-[#f8faf7] p-6 shadow-md">
      <header className="mb-4 flex items-center gap-2 text-emerald-950">
        <span className="text-lg font-bold">‹</span>
        <h2 className="text-base font-bold">Nuevo reporte</h2>
      </header>

      <div className="mb-4 flex gap-2 text-xs font-semibold">
        <span className="rounded-full bg-[#165a38] px-3 py-1 text-white">
          1 Detalles
        </span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-900">
          2 Ubicación
        </span>
      </div>

      <h3 className="text-xl font-bold text-emerald-950">
        Cuéntanos qué sucede
      </h3>
      <p className="mt-1 text-xs text-zinc-500">
        Una foto y una ubicación nos ayudan a atenderlo.
      </p>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-emerald-900/10 text-2xl">
          {tieneFoto ? "🛣️" : "📷"}
        </div>

        <div className="flex flex-col items-start gap-1.5">
          <span className="text-xs font-bold text-emerald-950">
            Foto del problema *
          </span>

          {tieneFoto ? (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
              1 foto adjunta
            </span>
          ) : (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              Sin foto adjunta
            </span>
          )}

          <span className="text-xs font-semibold text-[#165a38]">
             {tieneFoto ? "Cambiar foto" : "Subir foto"}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-xs font-bold text-emerald-950">
          Categoría *
        </label>
        <select
          defaultValue={categoriaSeleccionada}
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-emerald-700"
        >
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.nombre}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs font-bold text-emerald-950">
          Título *
        </label>
        <input
          type="text"
          defaultValue={titulo}
          placeholder="Ej. Bache en acceso peatonal"
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-700 outline-none focus:border-emerald-700"
        />
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs font-bold text-emerald-950">
          Descripción *
        </label>
        <textarea
          rows={3}
          defaultValue={descripcion}
          placeholder="Describe el problema..."
          className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-600 outline-none focus:border-emerald-700"
        />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-100/70 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="text-base"></span>
          <div>
            <p className="text-xs font-bold text-emerald-950">{ubicacion}</p>
            <p className="text-[11px] text-emerald-800">
              Ubicación lista · Cambiar
            </p>
          </div>
        </div>
        <span className="font-bold text-emerald-900">›</span>
      </div>

      <button
        type="button"
        className="mt-5 w-full rounded-xl bg-[#165a38] py-3 text-sm font-semibold text-white hover:bg-emerald-900"
      >
        Enviar reporte
      </button>
    </article>
  );
}
