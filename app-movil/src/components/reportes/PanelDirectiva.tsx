import { useState } from 'react';
import { Modal, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BotonPrincipal } from '@/components/ui/BotonPrincipal';
import { ColoresCivora } from '@/constants/coloresCivora';
import type { EstadoReporte, ReporteVecinal } from '@/types/reportes';

const LIMITE_NOTA = 140;
const ETIQUETA_ESTADO: Record<EstadoReporte, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  resuelto: 'Resuelto',
};

interface PanelDirectivaProps {
  reporte: ReporteVecinal;
  alCambiarEstado: (estado: EstadoReporte, nota?: string) => Promise<void>;
}

/** Acciones de la directiva: marcar En proceso (opcional) o Resuelto, con nota breve y confirmación. */
export function PanelDirectiva({ reporte, alCambiarEstado }: PanelDirectivaProps) {
  const insets = useSafeAreaInsets();
  const [nota, setNota] = useState('');
  const [estadoPorConfirmar, setEstadoPorConfirmar] = useState<EstadoReporte | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const cerrarConfirmacion = () => {
    if (enviando) return;
    setEstadoPorConfirmar(null);
    setError(null);
  };

  const confirmar = async () => {
    if (!estadoPorConfirmar || enviando) return;
    setEnviando(true);
    setError(null);
    try {
      await alCambiarEstado(estadoPorConfirmar, nota);
      setExito(`Estado actualizado a ${ETIQUETA_ESTADO[estadoPorConfirmar]}.`);
      setNota('');
      setEstadoPorConfirmar(null);
    } catch {
      setError('No pudimos actualizar el estado. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const iniciarCambio = (estado: EstadoReporte) => {
    setExito(null);
    setError(null);
    setEstadoPorConfirmar(estado);
  };

  return (
    <View className="gap-3 rounded-2xl border border-civora-border bg-civora-card p-4">
      <Text className="text-base font-bold text-civora-text">Acciones de la directiva</Text>

      {exito ? (
        <View className="rounded-xl bg-civora-resolvedBg px-3 py-2.5">
          <Text className="text-sm font-semibold text-civora-resolvedText">{exito}</Text>
        </View>
      ) : null}

      {reporte.estado === 'resuelto' ? (
        <Text className="text-sm text-civora-muted">Este reporte ya está resuelto.</Text>
      ) : (
        <>
          <View>
            <Text className="mb-2 text-sm font-semibold text-civora-text">
              Nota para el vecino (opcional)
            </Text>
            <TextInput
              value={nota}
              onChangeText={setNota}
              maxLength={LIMITE_NOTA}
              multiline
              placeholder="Ej.: La cuadrilla lo repara esta semana."
              placeholderTextColor={ColoresCivora.placeholder}
              textAlignVertical="top"
              className="min-h-[84px] w-full rounded-2xl border border-civora-border bg-civora-bg px-4 py-3 text-base text-civora-text"
            />
            <Text className="mt-1 text-right text-xs text-civora-muted">
              {nota.length}/{LIMITE_NOTA}
            </Text>
          </View>

          {reporte.estado === 'pendiente' ? (
            <BotonPrincipal
              texto="Marcar En proceso"
              variante="secundario"
              onPress={() => iniciarCambio('en_proceso')}
            />
          ) : null}
          <BotonPrincipal texto="Marcar Resuelto" onPress={() => iniciarCambio('resuelto')} />
        </>
      )}

      <Modal
        visible={estadoPorConfirmar !== null}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={cerrarConfirmacion}>
        <View className="flex-1 justify-end bg-[#102820]/55">
          <View
            className="rounded-t-[28px] bg-civora-bg px-6 pt-5"
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
            <Text className="text-xl font-bold text-civora-text">
              ¿Marcar como {estadoPorConfirmar ? ETIQUETA_ESTADO[estadoPorConfirmar] : ''}?
            </Text>
            <Text className="mt-1.5 text-sm leading-5 text-civora-muted">
              {reporte.titulo}. El vecino verá el nuevo estado
              {nota.trim() ? ' y tu nota' : ''}.
            </Text>
            {nota.trim() ? (
              <Text className="mt-3 rounded-xl bg-civora-surface px-3 py-2.5 text-sm text-civora-text">
                “{nota.trim()}”
              </Text>
            ) : null}
            {error ? (
              <Text className="mt-3 text-sm font-semibold text-red-700">{error}</Text>
            ) : null}
            <View className="mt-5 gap-3">
              <BotonPrincipal
                texto={enviando ? 'Guardando…' : error ? 'Reintentar' : 'Confirmar'}
                disabled={enviando}
                onPress={() => void confirmar()}
              />
              <BotonPrincipal
                texto="Cancelar"
                variante="secundario"
                disabled={enviando}
                onPress={cerrarConfirmacion}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
