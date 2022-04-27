import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  navContainer: {
    display: 'none',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    padding: '10px 20px',
    position: 'fixed',
    top: 0,
    borderBottom: `1px solid ${theme.colors.gray[4]}`,

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'flex',
    },
  },
  navBrandTitle: {
    fontSize: '2rem',
    fontFamily: 'Damion',
    color: 'black',
  },
  navBrandLink: {
    textDecoration: 'none',
  },
  navBarButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
  },
}));
