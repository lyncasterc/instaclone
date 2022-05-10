import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    borderBottom: `1px solid ${theme.colors.gray[4]}`,
    padding: '10px 0',
    marginBottom: 20,

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      borderBottom: 'none',
      justifyContent: 'flex-start',
      marginBottom: 0,
    },
  },
  itemLabel: {
    color: theme.colors.gray[6],
    fontWeight: 400,
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      color: 'inherit',
    },
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'row',
      flex: 0,
      gap: 4,
    },
  },
}));
