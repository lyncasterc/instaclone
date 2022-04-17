import { useField } from 'formik';
import {
  TextInput,
  TextInputProps,
  createStyles,
} from '@mantine/core';
import { CircleX, CircleCheck } from 'tabler-icons-react';

interface FormikInputProps extends TextInputProps {
  name: string,
}

const useStyles = createStyles((theme) => ({
  root: {
    marginBottom: '5px',
  },
  filled: {
    backgroundColor: theme.colors.gray[0],
    border: '1px solid',
    borderColor: theme.colors.gray[4],
  },
}));

function FormikTextInput({ name, ...props }: FormikInputProps) {
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
        />
      );
    }

    if (touchedAndNoError) {
      return (
        <CircleCheck
          strokeWidth={1.5}
          size={25}
          color="#868E96"
          data-testid="redx"
        />
      );
    }

    return null;
  };

  return (
    <TextInput
      classNames={{
        root: classes.root,
        filledVariant: classes.filled,
      }}
      {...field}
      {...props}
      rightSection={renderIcon()}
    />
  );
}

export default FormikTextInput;
