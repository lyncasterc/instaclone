import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  baseStyles: {
    backgroundColor: 'white',
    width: '100%',
    padding: '0 16px',
    position: 'sticky',
    zIndex: 5,
    top: 0,
    height: 44,
    borderBottom: `1px solid ${theme.colors.gray[4]}`,

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
}));
