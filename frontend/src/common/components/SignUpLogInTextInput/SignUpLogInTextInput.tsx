import { useField } from 'formik';
import {
  TextInput,
} from '@mantine/core';
import { IconCircleX, IconCircleCheck } from '@tabler/icons-react';
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
        <IconCircleX
          strokeWidth={1.5}
          size={25}
          color="red"
          data-testid="redx"
        />
      );
    }

    if (touchedAndNoError) {
      return (
        <IconCircleCheck
          strokeWidth={1.5}
          size={25}
          color="#868E96"
          data-testid="input-circle-check"
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
