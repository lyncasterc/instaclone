import { createStyles } from '@mantine/core';

export default createStyles(() => ({
  postCreatorBar: {
    height: 56,
    padding: '0 14px',
  },
  postCreatorLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  placeholderIcon: {
    width: '100%',
    height: '100%',
  },
  likeCommentContainer: {
    padding: '14px',
  },
  activeOpacityLight: {
    '&:active': {
      opacity: 0.5,
    },
  },
  createdAt: {
    color: '#737373',
    fontWeight: 400,
  },
  createdContainer: {
    padding: '0 14px',
  },
}));
