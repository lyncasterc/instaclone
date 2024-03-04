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
  threeItemNavContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  closeButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'black',
  },
  nextButton: {
    color: theme.colors.instaBlue[6],
    textDecoration: 'none',
    fontWeight: 700,
  },
  header: {
    fontSize: '1rem',
    flexGrow: 1,
    textAlign: 'center',
    position: 'relative',
  },
}));
