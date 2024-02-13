import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
  backBtn: {
  },
  backBtnContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: '1rem',
    flexGrow: 1,
    textAlign: 'center',
    position: 'relative',

  },
}));
