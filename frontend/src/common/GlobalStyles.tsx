import { Global } from '@mantine/core';

function GlobalStyles() {
  return (
    <Global
      styles={{
        body: {
          backgroundColor: '#fafafa',
        },
      }}
    />
  );
}

export default GlobalStyles;
