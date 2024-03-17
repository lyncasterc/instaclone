import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    maxHeight: theme.other.mobileContainerMaxHeight,
    overflowY: 'auto',
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      border: `1px solid ${theme.colors.gray[4]}`,
      padding: '1rem',
      marginTop: 60,
      minHeight: 500,
      maxHeight: 400,
    },
  },
}));
