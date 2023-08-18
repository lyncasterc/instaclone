import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  textInputroot: {
    marginBottom: '5px',
  },
  textInputFilled: {
    backgroundColor: theme.colors.gray[0],
    border: '1px solid',
    borderColor: theme.colors.gray[4],
  },
}));
