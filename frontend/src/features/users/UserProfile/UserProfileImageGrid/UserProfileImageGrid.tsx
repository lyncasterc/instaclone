import {
  SimpleGrid,
  Container,
  Image,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import useStyles from './UserProfileImageGrid.styles';
import { Post } from '../../../../app/types';

interface UserProfileImageGridProps {
  posts: Post[];
}

function UserProfileImageGrid({ posts }: UserProfileImageGridProps) {
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
        data-cy="user-profile-image-grid"
      >
        {
          [...posts].reverse().map((post) => {
            const { id, image: { url } } = post;
            return (
              <Link
                to={`/p/${id}`}
                key={id}
              >
                <Image
                  src={url}
                />
              </Link>
            );
          })
        }
      </SimpleGrid>
    </Container>
  );
}

export default UserProfileImageGrid;
