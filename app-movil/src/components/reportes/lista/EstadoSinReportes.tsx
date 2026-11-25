import { SymbolView } from 'expo-symbols';
import { Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import { ColoresCivora } from '@/constants/coloresCivora';

export interface EstadoSinReportesProps {
  titulo?: string;
  descripcion?: string;
  textoBoton?: string;
  alReportarProblema?: () => void;
}

export function EstadoSinReportes({
  titulo = 'Aún no hay reportes',
  descripcion = 'Sé el primero en reportar un problema en tu residencial.',
  textoBoton = 'Reportar un problema',
  alReportarProblema,
}: EstadoSinReportesProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-civora-surface">
        <SymbolView
          name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
          size={30}
          tintColor={ColoresCivora.primary}
        />
      </View>

      <Text className="mt-5 text-center text-xl font-bold text-civora-text">{titulo}</Text>

      <Text className="mt-2 max-w-[270px] text-center text-sm leading-5 text-civora-muted">
        {descripcion}
      </Text>

      {alReportarProblema ? (
        <View className="mt-6 w-full max-w-[300px]">
          <BotonPrincipal texto={textoBoton} onPress={alReportarProblema} />
        </View>
      ) : null}
    </View>
  );
}
