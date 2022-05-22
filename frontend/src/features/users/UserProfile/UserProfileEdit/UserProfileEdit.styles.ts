import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    border: `1px solid ${theme.colors.gray[4]}`,
    borderBottom: 'none',
    minHeight: '100vh',
    padding: '20px 20px',
  },
  inputLabel: {
    fontWeight: 600,
    fontSize: '1rem',
  },
  input: {
    fontSize: '1rem',
  },
  usernameAvatarContainer: {
    display: 'flex',
    gap: 20,
  },
  placeholderIcon: {
    width: 38,
    height: 38,
  },
  avatarRoot: {
    cursor: 'pointer',
  },
}));
