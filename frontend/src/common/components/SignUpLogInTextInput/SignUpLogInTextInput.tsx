import { useField } from 'formik';
import {
  TextInput,
} from '@mantine/core';
import { CircleX, CircleCheck } from 'tabler-icons-react';
import useStyles from './SignUpLogInTextInput.styles';
import type { FormikInputProps } from '../FormikTextInput';

function SignUpLogInTextInput({ name, ...props }: FormikInputProps) {
  const [
    field,
    meta,
  ] = useField(name);
  const showError = meta.touched && meta.error;
  const touchedAndNoError = meta.touched && !meta.error;
  const { classes } = useStyles();

  const renderIcon = () => {
    if (showError) {
      return (
        <CircleX
          strokeWidth={1.5}
          size={25}
          color="red"
          data-testid="redx"
        />
      );
    }

    if (touchedAndNoError) {
      return (
        <CircleCheck
          strokeWidth={1.5}
          size={25}
          color="#868E96"
        />
      );
    }

    return null;
  };

  return (
    <TextInput
      classNames={{
        root: classes.textInputroot,
        filledVariant: classes.textInputFilled,
      }}
      {...field}
      {...props}
      rightSection={renderIcon()}
    />
  );
}

export default SignUpLogInTextInput;
