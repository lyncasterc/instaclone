import {
  Button as MantineButton,
  ButtonProps,
} from '@mantine/core';

interface CustomButtonProps extends ButtonProps<'button'> {
  text: string,
}

function Button({ text, ...props }: CustomButtonProps) {
  return (
    <MantineButton
      {...props}
      sx={(theme) => ({
        '&:active': {
          opacity: 0.8,
          backgroundColor: theme.colors.instaBlue[3],
        },
        '&:hover': {
          backgroundColor: theme.colors.instaBlue[6],
        },
        width: '80%',
      })}
    >
      {text}
    </MantineButton>
  );
}

export default Button;
