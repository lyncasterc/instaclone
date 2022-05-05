import { Global } from '@mantine/core';

function GlobalStyles() {
  return (
    <Global
      styles={(theme) => ({
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
        body: {
          backgroundColor: theme.colors.gray[0],
          color: theme.colors.instaDark[6],
          width: '100%',
        },
      })}
    />
  );
}

export default GlobalStyles;
