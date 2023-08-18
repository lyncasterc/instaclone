import {
  SimpleGrid,
  Container,
} from '@mantine/core';
import useStyles from './UserProfileImageGrid.styles';
import GridImage from './GridImage/GridImage';

// TODO: add prop for user images
function UserProfileImageGrid() {
  const { classes } = useStyles();

  return (

    <Container
      size="md"
      px="0"
    >
      <SimpleGrid
        cols={3}
        spacing="xs"
        className={classes.grid}
      >
        <GridImage
          src="https://picsum.photos/200/300"
          alt=""
        />
        <GridImage
          src="https://picsum.photos/200/300"
          alt=""
        />
        <GridImage
          src="https://picsum.photos/200/300"
          alt=""
        />
      </SimpleGrid>
    </Container>
  );
}

export default UserProfileImageGrid;
