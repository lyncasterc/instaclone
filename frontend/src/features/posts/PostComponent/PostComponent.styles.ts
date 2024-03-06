import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  postContainer: {
    position: 'relative',
    zIndex: -1,
    paddingBottom: 10,
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
  },
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
