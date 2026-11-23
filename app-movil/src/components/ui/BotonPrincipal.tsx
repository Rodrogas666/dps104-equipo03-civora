import { Pressable, Text, type PressableProps } from 'react-native';

interface BotonPrincipalProps extends Omit<PressableProps, 'children'> {
  texto: string;
  variante?: 'primario' | 'secundario' | 'acento';
  className?: string;
}

export function BotonPrincipal({
  texto,
  variante = 'primario',
  disabled,
  className = '',
  ...props
}: BotonPrincipalProps) {
  const estilosContenedor =
    variante === 'primario'
      ? 'bg-civora-primary hover:bg-civora-primaryDark active:bg-civora-primaryDark'
      : variante === 'acento'
        ? 'bg-civora-accent hover:bg-civora-accentDark active:bg-civora-accentDark'
        : 'bg-civora-surface hover:opacity-90 active:opacity-80';

  const estilosTexto = variante === 'primario' ? 'text-white' : 'text-civora-text';

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      className={`w-full cursor-pointer items-center justify-center rounded-2xl py-4 ${estilosContenedor} ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
      {...props}>
      <Text className={`text-base font-semibold ${estilosTexto}`}>{texto}</Text>
    </Pressable>
  );
}
