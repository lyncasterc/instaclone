import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    minHeight: `calc(100vh - ${theme.other.topMobileNavHeight}px - ${theme.other.bottomMobileNavHeight}px)`,
  },
}));
