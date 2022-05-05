import { createStyles } from '@mantine/core';

// TODO: make buttons less tall on mobile

export default createStyles((theme) => ({
  navContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    backgroundColor: 'white',
    width: '100%',
    padding: '0 16px',
    height: 44,
    position: 'sticky',
    top: 0,
    borderBottom: `1px solid ${theme.colors.gray[4]}`,
  },
  navBarButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
  },
  buttonRoot: {
    height: 30,
  },
  signupButtonRoot: {
    padding: 0,
  },
  hideOnMobile: {
    display: 'none',
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'flex',
    },
  },
}));
