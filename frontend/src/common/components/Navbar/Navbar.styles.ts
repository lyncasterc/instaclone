import { createStyles } from '@mantine/core';

export default createStyles(() => ({
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    padding: '10px 20px',
    position: 'fixed',
    top: 0,
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
