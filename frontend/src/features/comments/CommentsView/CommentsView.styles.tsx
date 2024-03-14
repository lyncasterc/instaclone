import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    overflowY: 'auto',
    position: 'relative',
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      marginTop: 60,
      border: `1px solid ${theme.colors.gray[4]}`,
    },
  },
  commentsContainer: {
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      height: 400,
      overflowY: 'auto',
    },
  },
  avatarFormContainer: {
    position: 'fixed',
    bottom: theme.other.bottomMobileNavHeight,
    left: 0,
    width: '100%',
    borderTop: `1px solid ${theme.colors.gray[4]}`,
    padding: 16,
    zIndex: 900,
    background: 'white',
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      position: 'initial',
    },
  },
  formContainer: {
    flex: 2,
  },
  textarea: {
    border: 0,
    flex: 2,
    resize: 'none',
    maxHeight: 80,

    '&:focus': {
      outline: 0,
    },

    '&::placeholder': {
      color: '#737373',
      fontSize: 14,
    },
  },
  submitButtonText: {
    color: theme.colors.instaBlue[6],
    fontWeight: 700,
    fontSize: 14,

    '&:active': {
      opacity: 0.5,
    },
  },
  replyingToText: {
    color: '#737373',
    fontWeight: 500,
  },
}));
