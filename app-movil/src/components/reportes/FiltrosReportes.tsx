

import { Pressable, Text, View } from 'react-native';

export type FiltroMisReportes = 'todos' | 'activos' | 'resueltos';

interface FiltrosReportesProps {
  filtroActual: FiltroMisReportes;
  alCambiarFiltro: (filtro: FiltroMisReportes) => void;
  cantidades: {
    todos: number;
    activos: number;
    resueltos: number;
  };
}

const FILTROS: { etiqueta: string; valor: FiltroMisReportes }[] = [
  { etiqueta: 'Todos', valor: 'todos' },
  { etiqueta: 'Activos', valor: 'activos' },
  { etiqueta: 'Resueltos', valor: 'resueltos' },
];

export function FiltrosReportes({
  filtroActual,
  alCambiarFiltro,
  cantidades,
}: FiltrosReportesProps) {
  return (
    <View className="mt-5 flex-row rounded-xl bg-civora-surface p-1">
      {FILTROS.map((filtro) => {
        const seleccionado = filtroActual === filtro.valor;

        return (
          <Pressable
            key={filtro.valor}
            onPress={() => alCambiarFiltro(filtro.valor)}
            className={`flex-1 items-center rounded-lg py-3 ${
              seleccionado ? 'bg-civora-primary' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                seleccionado ? 'text-white' : 'text-civora-muted'
              }`}
            >
              {filtro.etiqueta} ({cantidades[filtro.valor]})
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
