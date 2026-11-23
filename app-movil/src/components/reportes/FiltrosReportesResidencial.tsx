import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ColoresCivora } from '@/constants/coloresCivora';
import type { CategoriaReporte, FiltroEstadoReporte } from '@/types/reportes';

interface OpcionCategoria {
  valor: CategoriaReporte;
  etiqueta: string;
  icono: SymbolViewProps['name'];
}

interface OpcionEstado {
  valor: FiltroEstadoReporte;
  etiqueta: string;
}

const OPCIONES_CATEGORIA: OpcionCategoria[] = [
  {
    valor: 'bache',
    etiqueta: 'Bache',
    icono: { ios: 'road.lanes', android: 'edit_road', web: 'edit_road' },
  },
  {
    valor: 'basura',
    etiqueta: 'Basura',
    icono: { ios: 'trash', android: 'delete', web: 'delete' },
  },
  {
    valor: 'alumbrado',
    etiqueta: 'Alumbrado',
    icono: { ios: 'lightbulb', android: 'lightbulb', web: 'lightbulb' },
  },
  {
    valor: 'otro',
    etiqueta: 'Otro',
    icono: { ios: 'doc.text', android: 'description', web: 'description' },
  },
];

const OPCIONES_ESTADO: OpcionEstado[] = [
  { valor: 'todos', etiqueta: 'Todos' },
  { valor: 'pendiente', etiqueta: 'Pendiente' },
  { valor: 'en_proceso', etiqueta: 'En proceso' },
  { valor: 'resuelto', etiqueta: 'Resuelto' },
];

interface FiltrosReportesResidencialProps {
  categoriaSeleccionada: CategoriaReporte | null;
  estadoSeleccionado: FiltroEstadoReporte;
  alSeleccionarCategoria: (categoria: CategoriaReporte | null) => void;
  alSeleccionarEstado: (estado: FiltroEstadoReporte) => void;
}

export function FiltrosReportesResidencial({
  categoriaSeleccionada,
  estadoSeleccionado,
  alSeleccionarCategoria,
  alSeleccionarEstado,
}: FiltrosReportesResidencialProps) {
  return (
    <View className="gap-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-2">
        {OPCIONES_CATEGORIA.map((categoria) => {
          const estaActiva = categoriaSeleccionada === categoria.valor;
          return (
            <Pressable
              key={categoria.valor}
              onPress={() =>
                alSeleccionarCategoria(estaActiva ? null : categoria.valor)
              }
              className={`cursor-pointer flex-row items-center gap-1.5 rounded-xl border px-3 py-1.5 ${
                estaActiva
                  ? 'border-civora-primary bg-civora-primary/15'
                  : 'border-transparent bg-civora-surface'
              }`}>
              <SymbolView
                name={categoria.icono}
                size={15}
                tintColor={ColoresCivora.primary}
              />
              <Text className="text-xs font-semibold text-civora-primary">
                {categoria.etiqueta}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-2">
        {OPCIONES_ESTADO.map((estado) => {
          const estaActivo = estadoSeleccionado === estado.valor;
          return (
            <Pressable
              key={estado.valor}
              onPress={() => alSeleccionarEstado(estado.valor)}
              className={`cursor-pointer rounded-xl px-3.5 py-2 ${
                estaActivo ? 'bg-civora-darkPill' : 'bg-civora-surface'
              }`}>
              <Text
                className={`text-xs font-semibold ${
                  estaActivo ? 'text-white' : 'text-civora-text'
                }`}>
                {estado.etiqueta}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
