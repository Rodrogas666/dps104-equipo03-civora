import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TarjetaResumenReporte } from '@/components/reportes/TarjetaResumenReporte';
import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import { ColoresCivora } from '@/constants/coloresCivora';
import { useReportes } from '@/context/ReportesContext';

export default function MisReportesScreen() {
  const { reportes, cargando, error, recargar } = useReportes();
  const mios = reportes.filter((r) => r.esMio);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: ColoresCivora.background }}>
      <ScrollView contentContainerClassName="px-5 pb-6 pt-3" showsVerticalScrollIndicator={false}>
        <Text role="heading" aria-level={1} className="text-[28px] font-bold text-civora-text">
          Mis reportes
        </Text>

        {cargando ? (
          <View className="items-center py-10">
            <ActivityIndicator color={ColoresCivora.primary} />
          </View>
        ) : error ? (
          <View className="mt-6 gap-3 rounded-2xl border border-civora-border bg-civora-card p-5">
            <Text className="text-sm text-civora-text">{error}</Text>
            <BotonPrincipal texto="Reintentar" onPress={() => void recargar()} />
          </View>
        ) : mios.length === 0 ? (
          <View className="mt-6 items-center gap-3 rounded-2xl border border-civora-border bg-civora-card p-6">
            <Text className="text-sm font-semibold text-civora-text">
              Aún no has reportado nada
            </Text>
            <BotonPrincipal texto="Reportar un problema" onPress={() => router.push('/nuevo-reporte')} />
          </View>
        ) : (
          <View className="mt-4 gap-3.5">
            {mios.map((reporte) => (
              <TarjetaResumenReporte
                key={reporte.id}
                reporte={reporte}
                alPresionar={(r) =>
                  router.push({ pathname: '/reporte/[id]', params: { id: r.id } })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
