import { useParams } from 'react-router-dom';
import { Container } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import GoBackNavbar from '../../../common/components/Navbars/GoBackNavbar/GoBackNavbar';
import { useGetPostByIdQuery } from '../../../app/apiSlice';
import PostComponent from '../PostComponent/PostComponent';
import useStyles from './PostView.styles';

interface PostViewProps {
  setAlertText: React.Dispatch<React.SetStateAction<string>>
}

function PostView({ setAlertText }: PostViewProps) {
  const { postId } = useParams();
  const { classes } = useStyles();
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');
  if (postId) {
    const { data: post, error } = useGetPostByIdQuery(postId);

    if (post && !error) {
      return (
        <Container
          size={isMediumScreenOrWider ? 'xs' : 'md'}
          classNames={{
            root: classes.postViewContainer,
          }}
          px={!isMediumScreenOrWider ? 0 : 'md'}
        >
          <GoBackNavbar text="Post" />
          <PostComponent post={post} setAlertText={setAlertText} />
        </Container>
      );
    }
  }

  return (
    <>
      Sorry, this page isn&apos;t available.
    </>
  );
}

export default PostView;
