import { Text, View } from 'react-native';

interface MarcoEncuadreCamaraProps {
  mostrarCuadricula?: boolean;
  capturada?: boolean;
}

export function MarcoEncuadreCamara({
  mostrarCuadricula = false,
  capturada = false,
}: MarcoEncuadreCamaraProps) {
  return (
    <View pointerEvents="none" className="absolute inset-0 justify-between p-5">
      {/* Cuadrícula opcional de regla de tercios */}
      {mostrarCuadricula && !capturada ? (
        <View className="absolute inset-0">
          <View className="absolute bottom-0 top-0 left-1/3 w-px bg-white/20" />
          <View className="absolute bottom-0 top-0 left-2/3 w-px bg-white/20" />
          <View className="absolute left-0 right-0 top-1/3 h-px bg-white/20" />
          <View className="absolute left-0 right-0 top-2/3 h-px bg-white/20" />
        </View>
      ) : null}

      {/* Esquinas superiores del visor */}
      {!capturada ? (
        <View className="mt-4 flex-1 justify-between px-3 py-4">
          <View className="flex-row justify-between">
            <View className="h-8 w-8 rounded-tl-xl border-l-[3px] border-t-[3px] border-civora-accent" />
            <View className="h-8 w-8 rounded-tr-xl border-r-[3px] border-t-[3px] border-civora-accent" />
          </View>

          <View className="flex-row justify-between">
            <View className="h-8 w-8 rounded-bl-xl border-b-[3px] border-l-[3px] border-civora-accent" />
            <View className="h-8 w-8 rounded-br-xl border-b-[3px] border-r-[3px] border-civora-accent" />
          </View>
        </View>
      ) : (
        <View className="flex-1" />
      )}

      {/* Indicador flotante de privacidad y encuadre */}
      <View className="items-center">
        <View className="rounded-2xl bg-black/60 px-4 py-2.5">
          <Text className="text-center text-xs font-semibold text-white">
            {capturada ? 'Revisa que el problema se vea nítido' : 'Encuadra el problema con claridad'}
          </Text>
          <Text className="mt-0.5 text-center text-[11px] text-white/75">
            Evita incluir rostros, placas o datos personales.
          </Text>
        </View>
      </View>
    </View>
  );
}
