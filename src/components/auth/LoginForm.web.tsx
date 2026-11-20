import { useRef, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input, type InputRef } from '@/components/ui/Input';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/SegmentedControl';
import type { AuthMode, LoginFormValues } from '@/types/auth';

export interface LoginFormProps {
  authOptions: SegmentedOption<AuthMode>[];
  onModeChange: (mode: AuthMode) => void;
  onSubmit?: (values: LoginFormValues) => void;
}

export function LoginForm({ authOptions, onModeChange, onSubmit }: LoginFormProps) {
  const passwordRef = useRef<InputRef>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit?.({ email: email.trim(), password });
  };

  return (
    <View className="w-full">
      <SegmentedControl
        options={authOptions}
        value="login"
        onChange={onModeChange}
        className="mb-7"
      />

      <View className="gap-5">
        <Input
          label="Correo"
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <Input
          ref={passwordRef}
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      </View>

      <View className="mt-8">
        <Button title="Entrar" onPress={handleSubmit} />
      </View>
    </View>
  );
}
