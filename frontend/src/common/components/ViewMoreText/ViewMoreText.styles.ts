import { createStyles } from '@mantine/core';

export default createStyles(() => ({
  viewMoreBtn: {
    color: '#737373',
    fontSize: 'inherit',
    fontWeight: 500,

    '&:active': {
      opacity: 0.5,
    },
  },
}));
