import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  modal: {
    borderRadius: 10,
    width: '83%',

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      width: '30%',
    },
  },
  modalBtn: {
    textAlign: 'center',
    display: 'block',
    width: '100%',
    padding: '20px 0',
    fontSize: '.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    '&:active': {
      backgroundColor: theme.colors.gray[2],
    },
    '&:first-of-type': {
      borderBottom: `1px solid ${theme.colors.gray[4]}`,
      borderTop: `1px solid ${theme.colors.gray[4]}`,
      color: theme.colors.red[6],
      fontWeight: 700,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
    },
    '&:last-of-type': {
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
  },
}));
