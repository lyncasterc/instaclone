import { Container } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import useAuth from '../../../common/hooks/useAuth';
import { selectAllUsers } from '../../../app/apiSlice';
import { useAppSelector } from '../../../common/hooks/selector-dispatch-hooks';
import PostComponent from '../PostComponent/PostComponent';

interface HomeProps {
  setAlertText: React.Dispatch<React.SetStateAction<string>>
}

function Home({ setAlertText }: HomeProps) {
  const [user] = useAuth();
  const is541PxOrWider = useMediaQuery('(min-width: 541px)');

  // Get all users that the current user follows

  // If you are somehow reading this, I know this is not the best way to do this but I'm tired lol
  // An separate endpoint to get all the homepage posts would be better
  const users = (useAppSelector(selectAllUsers)).filter(
    (u) => u.username === user! || u.followers?.find((f) => f.username === user!) != null,
  );

  const posts = users.flatMap((u) => u.posts ?? []).sort(
    (postA, postB) => new Date(postB.createdAt).getTime() - new Date(postA.createdAt).getTime(),
  );

  return (
    <Container
      size="xs"
      pt={is541PxOrWider ? 15 : 0}
      px={is541PxOrWider ? 16 : 0}
      pb={44}
      data-testid="homepage-container"
    >
      {posts.map((post) => (
        <PostComponent key={post.id} post={post} setAlertText={setAlertText} />
      ))}
    </Container>
  );
}

export default Home;
