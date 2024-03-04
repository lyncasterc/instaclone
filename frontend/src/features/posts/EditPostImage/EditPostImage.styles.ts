import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  cropperContainer: {
    height: '100vw',
    position: 'relative',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      height: '60vw',
    },
    '@media screen and (orientation: landscape)': {
      height: '60vh',
    },
  },
  desktopBtns: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    width: '50%',
  },
}));
