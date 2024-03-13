import { useParams } from 'react-router-dom';
import {
  Container,
  Divider,
  Text,
  Textarea,
  Group,
  UnstyledButton,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useGetPostByIdQuery, useGetParentCommentsByPostIdQuery } from '../../../app/apiSlice';
import GoBackNavbar from '../../../common/components/Navbars/GoBackNavbar/GoBackNavbar';
import getTimeSinceDate from '../../../common/utils/getTimeSinceDate';
import Caption from '../Caption';
import ParentComment from '../ParentComment';
import Avatar from '../../../common/components/Avatar/Avatar';
import useStyles from './CommentsView.styles';

function CommentsView() {
  const { postId } = useParams();
  const { data: post, error } = useGetPostByIdQuery(postId!);
  const { data: parentComments } = useGetParentCommentsByPostIdQuery(postId!);
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');
  const { classes } = useStyles();

  if (post && !error) {
    const {
      caption, creator: { image, username }, createdAt,
    } = post;
    const postTimeStamp = getTimeSinceDate(new Date(createdAt), { isCommentFormat: true });
    const creatorImage = image?.url || '';
    const doesPostHaveComments = parentComments && parentComments.length > 0;

    return (

      <>
        <GoBackNavbar text="Comments" />
        <Container
          size={isMediumScreenOrWider ? 'xs' : 'md'}
          py="md"
          className={classes.container}
        >
          {
          caption && (
            <>
              <Caption
                username={username}
                caption={caption}
                postTimeStamp={postTimeStamp}
                creatorImage={creatorImage}
              />
              <Divider my="sm" />
            </>
          )
        }

          {
          !doesPostHaveComments ? (
            <>
              <Text
                align="center"
                weight={700}
                size="xl"
                mt={10}
                mb={5}
              >
                No comments yet.
              </Text>
              <Text
                align="center"
                size="sm"
              >
                Start the conversation.
              </Text>
            </>
          ) : (
            parentComments.map((comment) => (
              <ParentComment key={comment.id} comment={comment} />
            ))
          )
        }

          <Group>
            <Avatar
              src={image?.url}
              alt={username}
            />
            <Group>
              <Textarea />
              <UnstyledButton>
                Post
              </UnstyledButton>
            </Group>
          </Group>
        </Container>
      </>

    );
  }

  return (
    <>
      Sorry, this page isn&apos;t available.
    </>
  );
}

export default CommentsView;
