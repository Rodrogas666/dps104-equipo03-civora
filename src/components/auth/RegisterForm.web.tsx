import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input, type InputRef } from '@/components/ui/Input';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/SegmentedControl';
import type { AuthMode, RegisterFormValues } from '@/types/auth';

export interface RegisterFormProps {
  authOptions: SegmentedOption<AuthMode>[];
  onModeChange: (mode: AuthMode) => void;
  onSubmit?: (values: RegisterFormValues) => void;
}

export function RegisterForm({ authOptions, onModeChange, onSubmit }: RegisterFormProps) {
  const emailRef = useRef<InputRef>(null);
  const passwordRef = useRef<InputRef>(null);
  const addressRef = useRef<InputRef>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = () => {
    onSubmit?.({
      name: name.trim(),
      email: email.trim(),
      password,
      address: address.trim(),
    });
  };

  return (
    <View className="w-full">
      <SegmentedControl
        options={authOptions}
        value="register"
        onChange={onModeChange}
        className="mb-6"
      />

      <View className="gap-4">
        <Input
          label="Nombre"
          placeholder="Tu nombre"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />

        <Input
          ref={emailRef}
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
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          returnKeyType="next"
          onSubmitEditing={() => addressRef.current?.focus()}
        />

        <Input
          ref={addressRef}
          label="Pasaje y polígono donde vives"
          placeholder="Ej. Pasaje 5, Polígono C"
          value={address}
          onChangeText={setAddress}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <Text className="mt-1 text-xs leading-5 text-civora-muted">
          Tu cuenta es de vecino. La directiva recibe su acceso de la administración.
        </Text>
      </View>

      <View className="mt-7">
        <Button title="Crear cuenta" onPress={handleSubmit} />
      </View>
    </View>
  );
}
