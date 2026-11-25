
import { Text, View } from 'react-native';

interface ResumenReportesProps {
  reportados: number;
  activos: number;
  resueltos: number;
}

export function ResumenReportes({
  reportados,
  activos,
  resueltos,
}: ResumenReportesProps) {
  return (
    <View className="mt-4 flex-row rounded-2xl bg-civora-primary px-3 py-4">
      <View className="flex-1 items-center">
        <Text className="text-2xl font-bold text-white">
          {reportados}
        </Text>
        <Text className="mt-1 text-xs text-white">
          Reportados
        </Text>
      </View>

      <View className="flex-1 items-center">
        <Text className="text-2xl font-bold text-white">
          {activos}
        </Text>
        <Text className="mt-1 text-xs text-white">
          Activos
        </Text>
      </View>

      <View className="flex-1 items-center">
        <Text className="text-2xl font-bold text-white">
          {resueltos}
        </Text>
        <Text className="mt-1 text-xs text-white">
          Resueltos
        </Text>
      </View>
    </View>
  );
}
