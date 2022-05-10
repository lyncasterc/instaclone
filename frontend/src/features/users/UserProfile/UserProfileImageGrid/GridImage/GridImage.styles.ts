import { createStyles } from '@mantine/core';

export default createStyles(() => ({
  imageWrapper: {
    aspectRatio: '1/1',
  },
  img: {
    display: 'block',
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
}));
