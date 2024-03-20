import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    borderBottom: `1px solid ${theme.colors.gray[4]}`,
    paddingTop: 16,
    paddingBottom: 16,

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      padding: '30px 16px',
      marginBottom: 25,
    },
  },
  // main section -> container holding avatar and name/buttons
  mainSection: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      gap: 50,
      paddingLeft: 10,
      paddingRight: 10,
    },
  },
  mainSectionUsername: {
    fontSize: '1.75rem',
    fontWeight: 300,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: '100%',
  },
  mainSectionRight: {
    flex: 1,
    width: '0%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  mainSectionNameBtns: {
    display: 'flex',
    flexDirection: 'column',

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
  },
  placeholderIcon: {
    width: '100%',
  },
  avatarRoot: {
    borderRadius: '50%',
    width: 77,
    height: 77,

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      width: 150,
      height: 150,
    },
  },
  loader: {
    zIndex: 5,
    position: 'absolute',
    top: 0,
    width: 79,
    height: 79,

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      width: 154,
      height: 154,
    },
  },
  loadingAvatar: {
    position: 'relative',
    top: 0,
    left: 0,
  },
  activeOpacityLight: {
    '&:active': {
      opacity: 0.5,
    },
  },
}));
