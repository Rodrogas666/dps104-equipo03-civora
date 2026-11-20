import { Text, View } from 'react-native';

interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export function AuthHeader({
  title = 'civora',
  subtitle = 'Reporta. Sigue. Mejora.',
  compact = false,
}: AuthHeaderProps) {
  return (
    <View className={`items-center ${compact ? 'pb-5 pt-5' : 'pb-8 pt-10'}`}>
      <Text
        role="heading"
        aria-level={1}
        className={`font-bold tracking-tight text-civora-primary ${
          compact ? 'text-[34px]' : 'text-[44px]'
        }`}>
        {title}
      </Text>
      <Text className="mt-1 text-sm font-normal text-civora-muted">{subtitle}</Text>
    </View>
  );
}
