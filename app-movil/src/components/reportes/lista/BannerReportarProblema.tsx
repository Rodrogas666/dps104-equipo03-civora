import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';

import { ColoresCivora } from '@/constants/coloresCivora';

interface BannerReportarProblemaProps {
  alReportarProblema?: () => void;
}

export function BannerReportarProblema({ alReportarProblema }: BannerReportarProblemaProps) {
  return (
    <View className="rounded-[28px] bg-civora-primary p-5">
      <Text className="text-[24px] font-bold leading-8 text-white">
        Una mejor residencial{'\n'}empieza contigo.
      </Text>

      <Pressable
        onPress={alReportarProblema}
        accessibilityRole="button"
        className="mt-5 cursor-pointer flex-row items-center justify-center gap-2 rounded-2xl bg-civora-accent py-4 hover:bg-civora-accentDark active:bg-civora-accentDark">
        <SymbolView
          name={{ ios: 'plus', android: 'add', web: 'add' }}
          size={18}
          tintColor={ColoresCivora.text}
        />
        <Text className="text-base font-semibold text-civora-text">Reportar un problema</Text>
      </Pressable>
    </View>
  );
}
