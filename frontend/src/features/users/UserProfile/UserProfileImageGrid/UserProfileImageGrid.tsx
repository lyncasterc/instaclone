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
          src="https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ"
          alt="picture of MacBook Air"
        />
        <GridImage
          src="https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ"
          alt="picture of MacBook Air"
        />
        <GridImage
          src="https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ"
          alt="picture of MacBook Air"
        />
      </SimpleGrid>
    </Container>
  );
}

export default UserProfileImageGrid;
