import { Global } from '@mantine/core';

function GlobalStyles() {
  return (
    <Global
      styles={(theme) => ({
        body: {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    />
  );
}

export default GlobalStyles;
