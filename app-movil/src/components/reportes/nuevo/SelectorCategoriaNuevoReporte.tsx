import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ColoresCivora } from '@/constants/coloresCivora';
import type { CategoriaReporte } from '@/types/reportes';

interface OpcionCategoria {
  valor: CategoriaReporte;
  etiqueta: string;
  icono: SymbolViewProps['name'];
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

interface SelectorCategoriaNuevoReporteProps {
  categoriaSeleccionada: CategoriaReporte;
  alSeleccionarCategoria: (categoria: CategoriaReporte) => void;
}

export function SelectorCategoriaNuevoReporte({
  categoriaSeleccionada,
  alSeleccionarCategoria,
}: SelectorCategoriaNuevoReporteProps) {
  return (
    <View className="w-full">
      <Text className="mb-2.5 text-sm font-semibold text-civora-text">Categoría *</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-2">
        {OPCIONES_CATEGORIA.map((categoria) => {
          const estaActiva = categoriaSeleccionada === categoria.valor;
          return (
            <Pressable
              key={categoria.valor}
              accessibilityRole="radio"
              accessibilityState={{ selected: estaActiva }}
              onPress={() => alSeleccionarCategoria(categoria.valor)}
              className={`cursor-pointer flex-row items-center gap-1.5 rounded-xl px-3.5 py-2 ${
                estaActiva
                  ? 'bg-civora-accent'
                  : 'bg-civora-surface hover:opacity-90'
              }`}>
              <SymbolView
                name={categoria.icono}
                size={15}
                tintColor={ColoresCivora.primary}
              />
              <Text
                className={`text-xs font-semibold ${
                  estaActiva ? 'text-civora-text' : 'text-civora-primary'
                }`}>
                {categoria.etiqueta}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
