import { Pressable, Text, View } from 'react-native';

export interface OpcionPestana<T extends string> {
  etiqueta: string;
  valor: T;
}

interface SelectorPestanasProps<T extends string> {
  opciones: OpcionPestana<T>[];
  valorActual: T;
  alCambiar: (valor: T) => void;
  className?: string;
}

export function SelectorPestanas<T extends string>({
  opciones,
  valorActual,
  alCambiar,
  className = '',
}: SelectorPestanasProps<T>) {
  return (
    <View className={`w-full flex-row rounded-2xl bg-civora-surface p-1.5 ${className}`}>
      {opciones.map((opcion) => {
        const estaActiva = opcion.valor === valorActual;
        return (
          <Pressable
            key={opcion.valor}
            accessibilityRole="tab"
            accessibilityState={{ selected: estaActiva }}
            onPress={() => alCambiar(opcion.valor)}
            className={`flex-1 cursor-pointer items-center justify-center rounded-xl py-2.5 ${
              estaActiva ? 'bg-civora-primary' : 'bg-transparent'
            }`}>
            <Text
              className={`text-sm font-semibold ${
                estaActiva ? 'text-white' : 'text-civora-text'
              }`}>
              {opcion.etiqueta}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
