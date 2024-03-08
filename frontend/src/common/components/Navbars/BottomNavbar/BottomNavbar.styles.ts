import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    zIndex: 1000,
    backgroundColor: 'white',
    width: '100%',
    padding: '5px 20px',
    position: 'fixed',
    bottom: 0,
    borderTop: `1px solid ${theme.colors.gray[4]}`,

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
}));
