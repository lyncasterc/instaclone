import { useField } from 'formik';
import {
  TextInput,
  TextInputProps,
} from '@mantine/core';

export interface FormikInputProps extends TextInputProps {
  name: string,
}

function FormikTextInput({ name, ...props }: FormikInputProps) {
  const [
    field,
  ] = useField(name);

  return (
    <TextInput
      {...field}
      {...props}
    />
  );
}

export default FormikTextInput;
