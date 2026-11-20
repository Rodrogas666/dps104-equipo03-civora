import { Pressable, Text, View } from 'react-native';

export interface SegmentedOption<T extends string> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <View className={`w-full flex-row rounded-2xl bg-civora-surface p-1.5 ${className}`}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(option.value)}
            className={`flex-1 cursor-pointer items-center justify-center rounded-xl py-2.5 ${
              isActive ? 'bg-civora-primary' : 'bg-transparent'
            }`}>
            <Text
              className={`text-sm font-semibold ${
                isActive ? 'text-white' : 'text-civora-text'
              }`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
