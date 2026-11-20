import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { AuthHeader } from '@/components/auth/AuthHeader';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import type { SegmentedOption } from '@/components/ui/SegmentedControl';
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
    <ScrollView
      className="flex-1 bg-civora-bg"
      contentContainerClassName="min-h-screen flex-grow items-center justify-center p-4 md:p-8">
      <View className="w-full max-w-4xl overflow-hidden rounded-3xl border border-civora-border bg-civora-card shadow-sm lg:flex-row">
        {/* Panel lateral de marca (visible en pantallas de escritorio) */}
        <View className="hidden justify-between bg-civora-primary p-10 lg:flex lg:w-5/12">
          <View>
            <Text className="text-4xl font-bold tracking-tight text-white">civora</Text>
            <Text className="mt-2 text-base text-civora-surface/90">
              Reporta. Sigue. Mejora.
            </Text>
          </View>

          <View className="gap-4">
            <View className="rounded-2xl bg-white/10 p-4">
              <Text className="text-sm font-semibold text-white">Reportes con evidencia</Text>
              <Text className="mt-1 text-xs leading-5 text-civora-surface/90">
                Informa baches, basura y alumbrado dañado con foto y ubicación exacta.
              </Text>
            </View>
            <View className="rounded-2xl bg-white/10 p-4">
              <Text className="text-sm font-semibold text-white">Seguimiento transparente</Text>
              <Text className="mt-1 text-xs leading-5 text-civora-surface/90">
                Consulta el estado en tiempo real: Pendiente, En proceso o Resuelto.
              </Text>
            </View>
          </View>

          <Text className="text-xs text-civora-surface/75">
            Civora · Gestión vecinal y mejora comunitaria
          </Text>
        </View>

        {/* Panel del formulario */}
        <View className="w-full bg-civora-bg p-6 sm:p-10 lg:w-7/12">
          <View className="lg:hidden">
            <AuthHeader compact={mode === 'register'} />
          </View>

          <View className="mb-6 hidden lg:flex">
            <Text className="text-2xl font-bold text-civora-text">
              {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta de vecino'}
            </Text>
            <Text className="mt-1 text-sm text-civora-muted">
              {mode === 'login'
                ? 'Ingresa con tu correo y contraseña para continuar.'
                : 'Completa tus datos para reportar incidencias en tu residencial.'}
            </Text>
          </View>

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
        </View>
      </View>
    </ScrollView>
  );
}
