import { Global } from '@mantine/core';

function GlobalStyles() {
  return (
    <Global
      styles={(theme) => ({
        // CSS debugging
        // '*': {
        //   border: '1px solid red',
        // },

        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
        body: {
          backgroundColor: 'white',
          color: theme.colors.instaDark[6],
          width: '100%',

          [`@media (min-width: ${theme.breakpoints.md}px)`]: {
            backgroundColor: theme.colors.gray[0],
          },
        },
      })}
    />
  );
}

export default GlobalStyles;
