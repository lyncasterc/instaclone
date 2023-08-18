import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  modalBtn: {
    textAlign: 'center',
    display: 'block',
    width: '100%',
    padding: '15px 0',
    fontSize: '.9rem',
    fontWeight: 700,
    cursor: 'pointer',
    '&:active': {
      backgroundColor: theme.colors.gray[2],
    },
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: 600,
    textAlign: 'center',
    margin: 0,
  },
  header: {
    width: '100%',
    justifyContent: 'center',
    borderBottom: `1px solid ${theme.colors.gray[4]}`,
    marginBottom: 0,
    padding: '25px 0',

  },
  modal: {
    borderRadius: 10,
    width: '83%',

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      width: '30%',
    },
  },
  inner: {
    alignItems: 'center',
  },
  modalUploadBtn: {
    color: theme.colors.instaBlue[6],
  },
  modalRemoveBtn: {
    color: theme.colors.red[6],
  },
  modalCancelBtn: {
    fontWeight: 400,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
}));
