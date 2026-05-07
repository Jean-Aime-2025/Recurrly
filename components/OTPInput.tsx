import { useRef } from 'react';
import { View, TextInput } from 'react-native';

const OTPInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const inputs = Array(6).fill(0);
  const refs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newValue = value.split('');
    newValue[index] = text;

    const joined = newValue.join('').slice(0, 6);

    onChange(joined);

    if (text && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      !value[index] &&
      index > 0
    ) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
      }}
    >
      {inputs.map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            refs.current[index] = ref;
          }}
          style={{
            width: 48,
            height: 56,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#d1d5db',
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '600',
          }}
          keyboardType="number-pad"
          maxLength={1}
          value={value[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
};

export default OTPInput;