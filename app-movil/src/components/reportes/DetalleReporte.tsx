import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EtiquetaEstadoReporte } from '@/components/reportes/EtiquetaEstadoReporte';
import { PanelDirectiva } from '@/components/reportes/PanelDirectiva';
import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import { ColoresCivora } from '@/constants/coloresCivora';
import { useReportes } from '@/context/ReportesContext';
import { useSesion } from '@/context/SesionContext';

export function DetalleReporte({ id }: { id: string }) {
  const { reportes, cargando, cambiarEstado } = useReportes();
  const { rol } = useSesion();
  const reporte = reportes.find((r) => r.id === id);

  const volver = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/inicio');
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: ColoresCivora.background }}>
      <View className="flex-row items-center gap-2 px-4 pb-2 pt-3">
        <Pressable
          onPress={volver}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          className="h-10 w-10 items-center justify-center rounded-full active:bg-civora-surface">
          <SymbolView
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={22}
            tintColor={ColoresCivora.text}
          />
        </Pressable>
        <Text className="text-xl font-bold text-civora-text">Detalle del reporte</Text>
      </View>

      {cargando && !reporte ? (
        <View className="items-center py-10">
          <ActivityIndicator color={ColoresCivora.primary} />
        </View>
      ) : !reporte ? (
        <View className="gap-3 px-6 pt-6">
          <Text className="text-sm text-civora-text">Este reporte ya no existe.</Text>
          <BotonPrincipal texto="Volver a la lista" onPress={() => router.replace('/inicio')} />
        </View>
      ) : (
        <ScrollView contentContainerClassName="gap-4 px-6 pb-8 pt-2" showsVerticalScrollIndicator={false}>
          <View className="overflow-hidden rounded-2xl bg-civora-surface">
            <Image
              source={{ uri: reporte.imagenUrl }}
              contentFit="cover"
              transition={200}
              style={{ width: '100%', height: 200 }}
            />
          </View>

          <View className="flex-row items-center justify-between">
            <EtiquetaEstadoReporte estado={reporte.estado} />
            <Text className="text-xs font-semibold text-civora-muted">{reporte.codigo}</Text>
          </View>

          <View>
            <Text className="text-2xl font-bold text-civora-text">{reporte.titulo}</Text>
            <Text className="mt-1 text-sm text-civora-muted">{reporte.ubicacion}</Text>
            <Text className="mt-0.5 text-xs text-civora-muted">{reporte.fechaHora}</Text>
          </View>

          {reporte.descripcion ? (
            <View>
              <Text className="mb-1 text-sm font-semibold text-civora-text">Descripción</Text>
              <Text className="text-sm leading-5 text-civora-text">{reporte.descripcion}</Text>
            </View>
          ) : null}

          {reporte.nota ? (
            <View className="rounded-2xl border border-civora-border bg-civora-card p-4">
              <Text className="mb-1 text-sm font-semibold text-civora-text">
                Nota de la directiva
              </Text>
              <Text className="text-sm leading-5 text-civora-text">{reporte.nota}</Text>
            </View>
          ) : null}

          {rol === 'directiva' ? (
            <PanelDirectiva
              reporte={reporte}
              alCambiarEstado={(estado, nota) => cambiarEstado(reporte.id, estado, nota)}
            />
          ) : null}

          <BotonPrincipal
            texto="Volver a la lista"
            variante="secundario"
            onPress={() => router.replace('/inicio')}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
