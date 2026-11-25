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
    <View className="flex-1 items-center justify-center py-8">
      <View className="w-full max-w-lg items-center rounded-3xl border border-civora-border bg-civora-card px-8 py-12 shadow-sm">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-civora-surface">
          <SymbolView
            name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
            size={32}
            tintColor={ColoresCivora.primary}
          />
        </View>

        <Text className="mt-5 text-center text-2xl font-bold tracking-tight text-civora-text">
          {titulo}
        </Text>

        <Text className="mt-2 max-w-sm text-center text-sm leading-5 text-civora-muted">
          {descripcion}
        </Text>

        {alReportarProblema ? (
          <View className="mt-7 w-full max-w-[280px]">
            <BotonPrincipal texto={textoBoton} onPress={alReportarProblema} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
