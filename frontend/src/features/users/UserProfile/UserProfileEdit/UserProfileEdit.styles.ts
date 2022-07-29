import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    minHeight: '100vh',
    padding: '20px 20px',
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      marginTop: 60,
      minHeight: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  inputLabel: {
    fontWeight: 600,
    fontSize: '1rem',
  },
  input: {
    fontSize: '1rem',
  },
  formControlRoot: {
    marginBottom: '1rem',
  },
  usernameAvatarContainer: {
    display: 'flex',
    gap: 20,
    marginBottom: '1rem',
  },
  usernameAvatarRight: {
    display: 'flex',
    flexDirection: 'column',
  },
  placeholderIcon: {
    width: 38,
    height: 38,
  },
  avatarRoot: {
    cursor: 'pointer',
  },
  loader: {
    zIndex: 5,
    position: 'absolute',
    top: 0,
    width: 39,
    height: 39,
  },
  loadingAvatar: {
    position: 'relative',
    top: 0,
    left: 0,
  },
  changeAvatarText: {
    color: theme.colors.instaBlue[6],
    fontWeight: 600,
    cursor: 'pointer',
  },
  submitButton: {
    maxWidth: '4.2rem',
    width: '100%',
    padding: '5px 9px',
    fontSize: '.875rem',
    fontWeight: 600,
  },
  form: {
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      border: `1px solid ${theme.colors.gray[4]}`,
      background: 'white',
      width: '55%',
      padding: '2rem 4rem',
    },
  },
}));
