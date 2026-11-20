import { Pressable, Text, type PressableProps } from 'react-native';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function Button({
  title,
  variant = 'primary',
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const containerStyles =
    variant === 'primary'
      ? 'bg-civora-primary hover:bg-civora-primaryDark active:bg-civora-primaryDark'
      : 'bg-civora-surface hover:opacity-90 active:opacity-80';

  const textStyles = variant === 'primary' ? 'text-white' : 'text-civora-text';

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      className={`w-full cursor-pointer items-center justify-center rounded-2xl py-4 ${containerStyles} ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
      {...props}>
      <Text className={`text-base font-semibold ${textStyles}`}>{title}</Text>
    </Pressable>
  );
}
