import { createStyles } from '@mantine/core';

export default createStyles(() => ({
  postContainer: {
    paddingBottom: 10,

    '@media (max-width: 375px)': {
      minHeight: '100vh',
    },

    '@media (max-height: 500px) and (orientation: landscape)': {
      minHeight: '260vh',
    },
  },
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
    position: 'relative',
    left: -5,
  },
  captionText: {
    lineHeight: 1.2,
  },
  captionCreatorLink: {
    lineHeight: 0,
  },
  postBottomSection: {
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  activeOpacityLight: {
    '&:active': {
      opacity: 0.5,
    },
  },
  createdAt: {
    color: '#737373',
    fontWeight: 400,
    lineHeight: 0.5,
  },
  commentsLink: {
    color: '#737373',
    fontWeight: 400,
  },
}));
