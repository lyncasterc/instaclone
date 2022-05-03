import { createStyles } from '@mantine/core';

export default createStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  backBtn: {
    position: 'fixed',
    left: 10,
    marginRight: 'auto',
  },
  username: {
    fontSize: '1rem',
  },
}));
