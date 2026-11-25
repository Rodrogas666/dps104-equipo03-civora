import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ModalPosibleDuplicado } from '@/components/reportes/nuevo/ModalPosibleDuplicado';
import { SelectorCategoriaNuevoReporte } from '@/components/reportes/nuevo/SelectorCategoriaNuevoReporte';
import { SelectorFotoReporte } from '@/components/reportes/nuevo/SelectorFotoReporte';
import { SelectorUbicacionReporte } from '@/components/reportes/nuevo/SelectorUbicacionReporte';
import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import { ColoresCivora } from '@/constants/coloresCivora';
import { useReportes } from '@/context/ReportesContext';
import {
  obtenerUbicacionBorrador,
  reiniciarUbicacionBorrador,
  suscribirUbicacionBorrador,
} from '@/services/estadoBorradorReporte';
import { buscarPosibleDuplicado } from '@/services/reportesService';
import {
  actualizarFotoReporte,
  obtenerFotoReporteActual,
  suscribirFotoReporte,
} from '@/services/estadoFotoReporte';
import type { CategoriaReporte, DatosNuevoReporte, ReporteVecinal } from '@/types/reportes';

export interface NuevoReporteProps {
  alVolver?: () => void;
  alEnviarReporte?: (datos: DatosNuevoReporte) => void;
}

export function NuevoReporte({ alVolver, alEnviarReporte }: NuevoReporteProps) {
  const insets = useSafeAreaInsets();
  const { reportes, crear } = useReportes();
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(() => obtenerFotoReporteActual());
  const [categoria, setCategoria] = useState<CategoriaReporte>('bache');
  const [ubicacion, setUbicacion] = useState(() => obtenerUbicacionBorrador());
  const [descripcion, setDescripcion] = useState('');
  const [reporteDuplicado, setReporteDuplicado] = useState<ReporteVecinal | null>(null);

  useEffect(
    () =>
      suscribirFotoReporte((url) => {
        setFotoUrl(url);
        // Al elegir una foto desaparece el aviso de "agrega una foto".
        if (url) setErrorEnvio(null);
      }),
    []
  );
  useEffect(() => suscribirUbicacionBorrador(setUbicacion), []);

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

  const confirmarEnvioFinal = async () => {
    if (enviando) return;
    if (!fotoUrl) {
      setErrorEnvio('Agrega una foto del problema para enviar el reporte.');
      return;
    }
    const datos: DatosNuevoReporte = {
      fotoUrl,
      categoria,
      ubicacion: ubicacion.trim(),
      descripcion: descripcion.trim(),
    };
    setReporteDuplicado(null);
    setErrorEnvio(null);
    setEnviando(true);
    try {
      await crear(datos);
      alEnviarReporte?.(datos);
      // Reinicia el borrador para que el siguiente "Nuevo reporte" arranque limpio.
      actualizarFotoReporte(null);
      reiniciarUbicacionBorrador();
      setDescripcion('');
      setCategoria('bache');
      router.replace('/reporte-enviado');
    } catch (e) {
      setErrorEnvio(
        e instanceof Error && e.message
          ? e.message
          : 'No pudimos enviar tu reporte. Revisa tu conexión e inténtalo de nuevo.'
      );
    } finally {
      setEnviando(false);
    }
  };

  const manejarPresionarEnviar = () => {
    if (!fotoUrl) {
      setErrorEnvio('Agrega una foto del problema para enviar el reporte.');
      return;
    }

    const posibleDuplicado = buscarPosibleDuplicado(reportes, categoria, ubicacion);

    if (posibleDuplicado) {
      setReporteDuplicado(posibleDuplicado);
      return;
    }

    void confirmarEnvioFinal();
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: ColoresCivora.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-1">
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
            <Text className="text-xl font-bold text-civora-text">Nuevo reporte</Text>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerClassName="flex-grow px-6 pb-8 pt-3"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Text
              role="heading"
              aria-level={1}
              className="text-[26px] font-bold tracking-tight text-civora-text">
              Cuéntanos qué sucede
            </Text>
            <Text className="mt-1 text-sm text-civora-muted">
              Toma menos de dos minutos.
            </Text>

            <View className="mt-6 gap-6">
              <SelectorFotoReporte
                fotoUrl={fotoUrl}
                alCambiarFoto={() => router.push('/tomar-foto')}
              />

              <SelectorCategoriaNuevoReporte
                categoriaSeleccionada={categoria}
                alSeleccionarCategoria={setCategoria}
              />

              <SelectorUbicacionReporte
                ubicacion={ubicacion}
                alAbrirMapa={() => router.push('/ubicacion-reporte')}
              />

              <View className="w-full">
                <Text className="mb-2 text-sm font-semibold text-civora-text">
                  Descripción (opcional)
                </Text>
                <TextInput
                  value={descripcion}
                  onChangeText={setDescripcion}
                  placeholder="Cuéntanos más (opcional)"
                  placeholderTextColor={ColoresCivora.placeholder}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="min-h-[104px] w-full rounded-2xl border border-civora-border bg-civora-card px-4 py-3.5 text-base text-civora-text outline-none focus:border-civora-primary"
                />
              </View>
            </View>
          </ScrollView>

          <View
            className="border-t border-civora-border/60 bg-civora-card px-6 pt-4"
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
            {errorEnvio ? (
              <Text className="mb-3 text-sm font-semibold text-red-700">{errorEnvio}</Text>
            ) : null}
            <BotonPrincipal
              texto={enviando ? 'Enviando…' : errorEnvio ? 'Reintentar envío' : 'Enviar reporte'}
              disabled={enviando}
              onPress={manejarPresionarEnviar}
            />
          </View>
        </View>

        <ModalPosibleDuplicado
          visible={Boolean(reporteDuplicado)}
          reporteSimilar={reporteDuplicado}
          alVerEseReporte={(reporte) => {
            setReporteDuplicado(null);
            router.push({ pathname: '/reporte/[id]', params: { id: reporte.id } });
          }}
          alEnviarDeTodosModos={() => void confirmarEnvioFinal()}
          alCancelar={() => setReporteDuplicado(null)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
