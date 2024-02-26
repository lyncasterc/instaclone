import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  captionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottom: `1px solid ${theme.colors.gray[4]}`,
    gap: 10,
  },
  postImage: {
    width: 52,
    height: 52,
  },
  captionInput: {
    border: 'none',
  },
  captionInputContainer: {
    flex: 2,
    padding: 0,
  },
  form: {
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      border: `1px solid ${theme.colors.gray[4]}`,
      background: 'white',
      padding: '2rem 4rem',
      marginTop: 100,
    },
  },
}));
