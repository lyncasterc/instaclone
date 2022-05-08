import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  navContainer: {
    alignItems: 'center',
    display: 'flex',
    backgroundColor: 'white',
    width: '100%',
    height: 60,
    position: 'sticky',
    zIndex: 5,
    top: 0,
    borderBottom: `1px solid ${theme.colors.gray[4]}`,
  },
  navInnerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    width: '100%',
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
