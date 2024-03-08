import { createStyles } from '@mantine/core';

export default createStyles(() => ({
  userPreviewContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  placeholderIcon: {
    width: '100%',
  },
  activeOpacityLight: {
    '&:active': {
      opacity: 0.5,
    },
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  text: {
    lineHeight: 0,
  },
  name: {
    color: '#737373',
  },
  followButton: {
    height: 30,
  },
}));
