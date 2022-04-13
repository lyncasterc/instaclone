import { useField } from 'formik';
import {
  TextInput as MantineTextInput,
  TextInputProps,
  createStyles,
} from '@mantine/core';
import { CircleX, CircleCheck } from 'tabler-icons-react';

interface CustomTextInputProps extends TextInputProps {
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

function TextInput({ name, ...props }: CustomTextInputProps) {
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
        />
      );
    }

    return null;
  };

  return (
    <MantineTextInput
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

export default TextInput;
