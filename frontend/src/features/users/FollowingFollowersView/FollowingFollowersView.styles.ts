import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  searchInput: {
    backgroundColor: '#EFEFEF',
    '&::placeholder': {
      color: '#737373',
    },
  },
  searchInputRoot: {
    paddingTop: 10,
    paddingBottom: 8,
  },
  noResultsContainer: {
    textAlign: 'center',
    color: '#737373',
    fontSize: 14,
  },
  container: {
    maxHeight: theme.other.mobileContainerMaxHeight,
    overflowY: 'auto',
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      border: `1px solid ${theme.colors.gray[4]}`,
      padding: '1rem',
      marginTop: 60,
      minHeight: 500,
      maxHeight: 400,
    },
  },
}));
