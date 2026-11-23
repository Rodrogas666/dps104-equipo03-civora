import { Text, View } from 'react-native';

interface EncabezadoAccesoCivoraProps {
  titulo?: string;
  subtitulo?: string;
  compacto?: boolean;
}

export function EncabezadoAccesoCivora({
  titulo = 'civora',
  subtitulo = 'Reporta. Sigue. Mejora.',
  compacto = false,
}: EncabezadoAccesoCivoraProps) {
  return (
    <View className={`items-center ${compacto ? 'pb-5 pt-5' : 'pb-8 pt-10'}`}>
      <Text
        role="heading"
        aria-level={1}
        className={`font-bold tracking-tight text-civora-primary ${
          compacto ? 'text-[34px]' : 'text-[44px]'
        }`}>
        {titulo}
      </Text>
      <Text className="mt-1 text-sm font-normal text-civora-muted">{subtitulo}</Text>
    </View>
  );
}
