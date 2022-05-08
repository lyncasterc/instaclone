import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    borderBottom: `1px solid ${theme.colors.gray[4]}`,
    paddingTop: 16,
    paddingBottom: 16,

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      padding: '30px 20px',
    },
  },
  buttonRoot: {
    height: 30,
    width: '100%',
  },
  buttonOutline: {
    borderColor: theme.colors.gray[4],
    color: theme.colors.instaDark[6],
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
  mainSectionButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    maxWidth: 250,
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
  followButtonRoot: {
    flexShrink: 2,
  },
  // Avatar icon
  avatarPlaceholder: {
    backgroundColor: `${theme.colors.gray[1]}`,
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
}));