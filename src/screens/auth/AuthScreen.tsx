import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import type { SegmentedOption } from '@/components/ui/SegmentedControl';
import { Colors } from '@/constants/colors';
import type { AuthMode, LoginFormValues, RegisterFormValues } from '@/types/auth';

const AUTH_OPTIONS: SegmentedOption<AuthMode>[] = [
  { label: 'Iniciar sesión', value: 'login' },
  { label: 'Crear cuenta', value: 'register' },
];

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleLogin = (_values: LoginFormValues) => {
    // TODO: Conectar inicio de sesión con src/services/
  };

  const handleRegister = (_values: RegisterFormValues) => {
    // TODO: Conectar registro con src/services/
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {mode === 'login' ? (
          <LoginForm
            authOptions={AUTH_OPTIONS}
            onModeChange={setMode}
            onSubmit={handleLogin}
          />
        ) : (
          <RegisterForm
            authOptions={AUTH_OPTIONS}
            onModeChange={setMode}
            onSubmit={handleRegister}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
