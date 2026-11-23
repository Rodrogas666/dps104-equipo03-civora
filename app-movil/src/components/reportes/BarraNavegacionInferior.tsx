import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ColoresCivora } from '@/constants/coloresCivora';
import type { PestanaInferiorCivora } from '@/types/reportes';

interface ItemNavegacion {
  valor: PestanaInferiorCivora;
  etiqueta: string;
  icono: SymbolViewProps['name'];
}

const ITEMS_NAVEGACION: ItemNavegacion[] = [
  {
    valor: 'inicio',
    etiqueta: 'Inicio',
    icono: { ios: 'house', android: 'home', web: 'home' },
  },
  {
    valor: 'reportar',
    etiqueta: 'Reportar',
    icono: { ios: 'plus', android: 'add', web: 'add' },
  },
  {
    valor: 'mis_reportes',
    etiqueta: 'Mis reportes',
    icono: { ios: 'doc.text', android: 'description', web: 'description' },
  },
];

interface BarraNavegacionInferiorProps {
  pestanaActiva: PestanaInferiorCivora;
  alCambiarPestana: (pestana: PestanaInferiorCivora) => void;
}

export function BarraNavegacionInferior({
  pestanaActiva,
  alCambiarPestana,
}: BarraNavegacionInferiorProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-around border-t border-civora-border/70 bg-civora-card px-4 pt-2.5"
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}>
      {ITEMS_NAVEGACION.map((item) => {
        const estaActiva = pestanaActiva === item.valor;
        return (
          <Pressable
            key={item.valor}
            accessibilityRole="tab"
            accessibilityState={{ selected: estaActiva }}
            onPress={() => alCambiarPestana(item.valor)}
            className={`cursor-pointer items-center justify-center rounded-2xl px-5 py-2 ${
              estaActiva ? 'bg-civora-surface' : 'bg-transparent'
            }`}>
            <SymbolView
              name={item.icono}
              size={20}
              tintColor={estaActiva ? ColoresCivora.primary : ColoresCivora.muted}
            />
            <Text
              className={`mt-1 text-xs ${
                estaActiva
                  ? 'font-semibold text-civora-primary'
                  : 'font-medium text-civora-muted'
              }`}>
              {item.etiqueta}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
