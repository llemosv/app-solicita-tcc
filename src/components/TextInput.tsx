import {
  Input as NativeBaseInput,
  IInputProps,
  FormControl,
} from 'native-base';
import { TextInput } from 'react-native';

type Props = IInputProps & {
  errorMessage?: string | null;
  placeholder: string;
  onChangeText: (text: string) => void;
};

export function InputText({
  errorMessage = null,
  isInvalid,
  placeholder,
  onChangeText,
  ...rest
}: Props) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <TextInput
        multiline
        textAlignVertical="top"
        style={{
          paddingTop: 15,
          paddingBottom: 15,
          paddingLeft: 10,
          paddingRight: 10,
          borderRadius: 4,
          fontSize: 16,
          color: '#E1E1E6',
          backgroundColor: '#202024',
          minWidth: '100%',
        }}
        placeholderTextColor="#7C7C8A"
        onChangeText={onChangeText}
        placeholder={placeholder}
      />

      <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
