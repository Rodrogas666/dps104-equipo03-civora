import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { ColoresCivora } from '@/constants/coloresCivora';

export interface ZonaMapaResidencial {
  id: string;
  etiqueta: string;
  direccion: string;
  pinTop: string;
  pinLeft: string;
}

export const ZONAS_MAPA_RESIDENCIAL: ZonaMapaResidencial[] = [
  {
    id: 'pasaje-5-poligono-c',
    etiqueta: 'Polígono C',
    direccion: 'Pasaje 5, Polígono C',
    pinTop: '43%',
    pinLeft: '28%',
  },
  {
    id: 'pasaje-3-poligono-a',
    etiqueta: 'Polígono A',
    direccion: 'Pasaje 3, Polígono A',
    pinTop: '62%',
    pinLeft: '51%',
  },
  {
    id: 'entrada-principal',
    etiqueta: 'Entrada',
    direccion: 'Entrada Principal, Las Palmas',
    pinTop: '63%',
    pinLeft: '80%',
  },
  {
    id: 'pasaje-2-poligono-b',
    etiqueta: 'Pasaje 5',
    direccion: 'Pasaje 5, Zona Verde',
    pinTop: '24%',
    pinLeft: '14%',
  },
];

interface MapaIlustrativoResidencialProps {
  direccionActual: string;
  alSeleccionarDireccion: (direccion: string) => void;
  altura?: number;
}

export function MapaIlustrativoResidencial({
  direccionActual,
  alSeleccionarDireccion,
  altura = 250,
}: MapaIlustrativoResidencialProps) {
  const zonaActiva =
    ZONAS_MAPA_RESIDENCIAL.find((z) => z.direccion === direccionActual) ??
    ZONAS_MAPA_RESIDENCIAL[0];

  return (
    <View
      className="relative w-full overflow-hidden rounded-2xl border border-civora-border bg-[#E4EBDD]"
      style={{ height: altura }}>
      {/* Calles principales (blancas) */}
      <View
        pointerEvents="none"
        className="absolute bottom-0 top-0 w-5 bg-white"
        style={{ left: '27%' }}
      />
      <View
        pointerEvents="none"
        className="absolute left-0 right-0 h-5 bg-white"
        style={{ top: '42%' }}
      />
      <View
        pointerEvents="none"
        className="absolute left-0 right-0 h-3.5 bg-white"
        style={{ bottom: '12%' }}
      />

      {/* Áreas verdes decorativas */}
      <Pressable
        onPress={() => alSeleccionarDireccion(ZONAS_MAPA_RESIDENCIAL[3].direccion)}
        className="absolute cursor-pointer rounded-2xl bg-[#CFDFBE] active:opacity-85"
        style={{ top: '6%', left: '4%', width: '19%', height: '54%' }}
      />
      <View
        pointerEvents="none"
        className="absolute rounded-2xl bg-[#CFDFBE]"
        style={{ top: '6%', right: '5%', width: '24%', height: '32%' }}
      />

      {/* Bloques seleccionables */}
      <Pressable
        onPress={() => alSeleccionarDireccion(ZONAS_MAPA_RESIDENCIAL[0].direccion)}
        className={`absolute cursor-pointer items-center justify-center rounded-xl border active:opacity-85 ${
          zonaActiva.id === 'pasaje-5-poligono-c'
            ? 'border-civora-primary/50 bg-[#CFD7CE]'
            : 'border-transparent bg-[#D5DDD4]'
        }`}
        style={{ top: '8%', left: '41%', width: '24%', height: '28%' }}>
        <Text className="text-[11px] font-semibold text-civora-text">Polígono C</Text>
      </Pressable>

      <Pressable
        onPress={() => alSeleccionarDireccion(ZONAS_MAPA_RESIDENCIAL[1].direccion)}
        className={`absolute cursor-pointer items-center justify-center rounded-xl border active:opacity-85 ${
          zonaActiva.id === 'pasaje-3-poligono-a'
            ? 'border-civora-primary/50 bg-[#CFD7CE]'
            : 'border-transparent bg-[#D5DDD4]'
        }`}
        style={{ top: '54%', left: '41%', width: '24%', height: '24%' }}>
        <Text className="text-[11px] font-semibold text-civora-text">Polígono A</Text>
      </Pressable>

      <Pressable
        onPress={() => alSeleccionarDireccion(ZONAS_MAPA_RESIDENCIAL[2].direccion)}
        className={`absolute cursor-pointer items-center justify-center rounded-xl border active:opacity-85 ${
          zonaActiva.id === 'entrada-principal'
            ? 'border-civora-primary/50 bg-[#CFD7CE]'
            : 'border-transparent bg-[#D5DDD4]'
        }`}
        style={{ top: '56%', right: '7%', width: '20%', height: '22%' }}>
        <Text className="text-[11px] font-semibold text-civora-text">Entrada</Text>
      </Pressable>

      {/* Etiquetas de calle y mapa */}
      <Text
        pointerEvents="none"
        className="absolute text-[10px] font-medium text-civora-muted"
        style={{ bottom: '4%', left: '4%' }}>
        Pasaje 5
      </Text>
      <Text
        pointerEvents="none"
        className="absolute text-[10px] font-medium text-civora-muted"
        style={{ bottom: '4%', right: '5%' }}>
        Mapa ilustrativo
      </Text>

      {/* Pin de ubicación seleccionada */}
      <View
        pointerEvents="none"
        className="absolute h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-civora-primary shadow-md"
        style={{
          top: zonaActiva.pinTop as `${number}%`,
          left: zonaActiva.pinLeft as `${number}%`,
          transform: [{ translateX: -12 }, { translateY: -12 }],
        }}>
        <SymbolView
          name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
          size={19}
          tintColor={ColoresCivora.white}
        />
      </View>
    </View>
  );
}
