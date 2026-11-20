import type { ComponentRef, Ref } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { ColoresCivora } from '@/constants/coloresCivora';

export type ReferenciaCampoTexto = ComponentRef<typeof TextInput>;

interface CampoTextoFormularioProps extends TextInputProps {
  ref?: Ref<ReferenciaCampoTexto>;
  etiqueta: string;
  error?: string;
  containerClassName?: string;
}

export function CampoTextoFormulario({
  ref,
  etiqueta,
  error,
  containerClassName = '',
  className = '',
  ...props
}: CampoTextoFormularioProps) {
  return (
    <View className={`w-full ${containerClassName}`}>
      <Text className="mb-1.5 text-sm font-semibold text-civora-text">{etiqueta}</Text>
      <TextInput
        ref={ref}
        placeholderTextColor={ColoresCivora.placeholder}
        className={`w-full rounded-2xl border bg-civora-card px-4 py-3.5 text-base text-civora-text outline-none focus:border-civora-primary ${
          error ? 'border-red-500' : 'border-civora-border'
        } ${className}`}
        {...props}
      />
      {error ? <Text className="mt-1.5 text-xs text-red-600">{error}</Text> : null}
    </View>
  );
}
