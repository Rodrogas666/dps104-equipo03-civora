import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ColoresCivora } from '@/constants/coloresCivora';
import { useReportes } from '@/context/ReportesContext';
import { useSesion } from '@/context/SesionContext';
import type { RolUsuario } from '@/types/autenticacion';

export interface PerfilUsuarioProps {
  nombre?: string;
  correo?: string;
  rol?: RolUsuario;
  pasajePoligono?: string;
  residencial?: string;
  reportesRealizados?: number;
  alVolver?: () => void;
  alCerrarSesion?: () => void;
}

export function PerfilUsuario({
  nombre: nombreProp,
  correo: correoProp,
  rol: rolProp,
  pasajePoligono: pasajePoligonoProp,
  residencial: residencialProp,
  reportesRealizados: reportesRealizadosProp,
  alVolver,
  alCerrarSesion,
}: PerfilUsuarioProps) {
  const insets = useSafeAreaInsets();
  const sesion = useSesion();
  const { reportes } = useReportes();

  const nombre = nombreProp ?? sesion.nombre;
  const correo = correoProp ?? sesion.correo;
  const rol = rolProp ?? sesion.rol ?? 'vecino';
  const pasajePoligono = pasajePoligonoProp ?? sesion.pasajePoligono ?? 'Pasaje 5, Polígono C';
  const residencial = residencialProp ?? sesion.residencial ?? 'Residencial Las Palmas';

  const totalReportes = useMemo(() => {
    if (typeof reportesRealizadosProp === 'number') return reportesRealizadosProp;
    return reportes.filter((r) => r.esMio === true).length;
  }, [reportes, reportesRealizadosProp]);

  const inicial = nombre.trim().charAt(0).toUpperCase() || 'V';
  const etiquetaRol = rol === 'directiva' ? 'Directiva' : 'Vecino';
  const textoReportes = `${totalReportes} ${totalReportes === 1 ? 'reporte' : 'reportes'}`;

  const manejarVolver = () => {
    if (alVolver) {
      alVolver();
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/inicio');
    }
  };

  const manejarCerrarSesion = () => {
    if (alCerrarSesion) {
      alCerrarSesion();
      return;
    }
    sesion.cerrarSesion();
    router.replace('/');
  };

  // Sin sesión no se pinta ningún dato (evita el parpadeo al cerrar sesión).
  if (!correo) return null;

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: ColoresCivora.background }}>
      <View className="flex-1">
        {/* Encabezado */}
        <View className="flex-row items-center gap-2 px-4 pb-2 pt-3">
          <Pressable
            onPress={manejarVolver}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            className="h-10 w-10 items-center justify-center rounded-full active:bg-civora-surface">
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={22}
              tintColor={ColoresCivora.text}
            />
          </Pressable>
          <Text className="text-xl font-bold text-civora-text">Perfil</Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 pb-8 pt-6"
          showsVerticalScrollIndicator={false}>
          {/* Avatar e información principal */}
          <View className="items-center">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-civora-primary">
              <Text className="text-4xl font-bold text-white">{inicial}</Text>
            </View>

            <Text
              role="heading"
              aria-level={1}
              className="mt-4 text-center text-2xl font-bold tracking-tight text-civora-text">
              {nombre}
            </Text>

            <Text className="mt-1 text-center text-sm text-civora-muted">{correo}</Text>

            <View className="mt-3 rounded-full bg-civora-accent px-4 py-1.5">
              <Text className="text-xs font-bold text-civora-text">{etiquetaRol}</Text>
            </View>
          </View>

          {/* Tarjeta de detalles */}
          <View className="mt-6 gap-4 rounded-2xl border border-civora-border bg-civora-card p-5">
            <View>
              <Text className="text-xs text-civora-muted">Pasaje y polígono</Text>
              <Text className="mt-0.5 text-sm font-bold text-civora-text">{pasajePoligono}</Text>
            </View>

            <View>
              <Text className="text-xs text-civora-muted">Residencial</Text>
              <Text className="mt-0.5 text-sm font-bold text-civora-text">{residencial}</Text>
            </View>

            <View>
              <Text className="text-xs text-civora-muted">Reportes realizados</Text>
              <Text className="mt-0.5 text-sm font-bold text-civora-text">{textoReportes}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Barra inferior fija con botón Cerrar sesión */}
        <View
          className="border-t border-civora-border/60 bg-civora-card px-6 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
          <Pressable
            onPress={manejarCerrarSesion}
            accessibilityRole="button"
            className="w-full cursor-pointer items-center justify-center rounded-2xl border border-civora-border bg-civora-card py-4 hover:bg-civora-bg active:bg-civora-surface">
            <Text className="text-base font-bold text-civora-text">Cerrar sesión</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
