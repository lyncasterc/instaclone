import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  buttonRoot: {
    height: 30,
    width: '100%',
  },
  buttonOutline: {
    borderColor: theme.colors.gray[4],
    color: theme.colors.instaDark[6],
  },
  editButtonRoot: {
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      width: 'inherit',
    },
  },
  followButtonRoot: {
    flexShrink: 2,
    '@media (max-width: 335px)': {
      padding: '0 10px',
    },
  },
  mainSectionButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    maxWidth: 250,
  },
}));
