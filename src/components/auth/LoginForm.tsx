import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthHeader } from '@/components/auth/AuthHeader';
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
  const insets = useSafeAreaInsets();
  const passwordRef = useRef<InputRef>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit?.({ email: email.trim(), password });
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-6 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <AuthHeader />

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
      </ScrollView>

      <View
        className="border-t border-civora-border/60 bg-civora-card px-6 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
        <Button title="Entrar" onPress={handleSubmit} />
      </View>
    </View>
  );
}
