import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  baseStyles: {
    backgroundColor: 'white',
    width: '100%',
    padding: '0 16px',
    position: 'fixed',
    top: 0,
    borderBottom: `1px solid ${theme.colors.gray[4]}`,

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
}));
