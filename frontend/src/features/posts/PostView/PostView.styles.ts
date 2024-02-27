import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  postViewContainer: {
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      backgroundColor: 'white',
      border: `1px solid ${theme.colors.gray[4]}`,
      padding: '1rem',
      marginTop: 60,
    },
  },
}));
