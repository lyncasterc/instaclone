import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {

  },
  grid: {
    gap: 3,

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      gap: 28,
    },
  },
}));
