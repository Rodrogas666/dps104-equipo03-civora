import type { ComponentRef, Ref } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { Colors } from '@/constants/colors';

export type InputRef = ComponentRef<typeof TextInput>;

interface InputProps extends TextInputProps {
  ref?: Ref<InputRef>;
  label: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  ref,
  label,
  error,
  containerClassName = '',
  className = '',
  ...props
}: InputProps) {
  return (
    <View className={`w-full ${containerClassName}`}>
      <Text className="mb-1.5 text-sm font-semibold text-civora-text">{label}</Text>
      <TextInput
        ref={ref}
        placeholderTextColor={Colors.placeholder}
        className={`w-full rounded-2xl border bg-civora-card px-4 py-3.5 text-base text-civora-text outline-none focus:border-civora-primary ${
          error ? 'border-red-500' : 'border-civora-border'
        } ${className}`}
        {...props}
      />
      {error ? <Text className="mt-1.5 text-xs text-red-600">{error}</Text> : null}
    </View>
  );
}
