import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  avatarLink: {
    alignSelf: 'stretch',
  },
  activeOpacityLight: {
    '&:active': {
      opacity: 0.5,
    },
  },
  repliesDividerContainer: {
    marginLeft: 53,
    marginBottom: 15,
  },
  repliesDivider: {
    width: 25,
    height: 1,
    backgroundColor: theme.colors.gray[4],
  },
  repliesContainer: {
    marginTop: 15,
  },
}));
