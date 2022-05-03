import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
  backBtn: {
    position: 'fixed',
    left: 10,
    marginRight: 'auto',
  },
  username: {
    fontSize: '1rem',
  },
}));
