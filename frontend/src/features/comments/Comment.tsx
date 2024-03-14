import {
  Text,
  Group,
  Stack,
  UnstyledButton,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconHeart, IconTrash } from '@tabler/icons-react';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import Avatar from '../../common/components/Avatar/Avatar';
import { Comment as CommentType } from '../../app/types';
import useStyles from './comments-captions.styles';
import { selectUserByUsername, useDeleteCommentByIdMutation } from '../../app/apiSlice';
import { useAppSelector } from '../../common/hooks/selector-dispatch-hooks';
import useAuth from '../../common/hooks/useAuth';
import getTimeSinceDate from '../../common/utils/getTimeSinceDate';
import ViewMoreText from '../../common/components/ViewMoreText/ViewMoreText';
import DeleteModal from '../../common/components/DeleteModal/DeleteModal';

interface CommentProps {
  comment: CommentType,
  parentCommentId?: string,
  setReplyRecipientUsername: React.Dispatch<React.SetStateAction<string>>,
}

function Comment({ comment, setReplyRecipientUsername, parentCommentId }: CommentProps) {
  const { classes } = useStyles();
  const { setFieldValue } = useFormikContext();
  const {
    author: { username: commentAuthorUsername },
    createdAt,
    body,
  } = comment;
  const commentAuthor = useAppSelector(
    (state) => selectUserByUsername(state, commentAuthorUsername),
  );
  const [currentUsername] = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteComment] = useDeleteCommentByIdMutation();

  if (commentAuthor) {
    const commentTimeStamps = getTimeSinceDate(new Date(createdAt), { isCommentFormat: true });
    const isCurrentUserTheCommentAuthor = currentUsername === commentAuthorUsername;

    return (
      <Group spacing="sm" pb={15} position="apart">
        <Link to={`/users/${commentAuthorUsername}`} className={classes.avatarLink}>
          <Avatar src={commentAuthor.image?.url} alt={commentAuthorUsername} />
        </Link>
        <Stack
          spacing={0}
          styles={{
            root: {
              flex: '1 !important',
            },
          }}
        >
          <div>
            <span>
              <Text
                component={Link}
                to={`/users/${commentAuthorUsername}`}
                color="black"
                weight={700}
                size="sm"
                className={classes.activeOpacityLight}
              >
                {commentAuthorUsername}
              </Text>
            </span>
            {' '}
            <span>
              <ViewMoreText
                text={body}
                size="sm"
                color="black"
                styles={{
                  root: {
                    display: 'inline',
                    lineHeight: 1,
                  },
                }}
              />
            </span>
          </div>
          <Group spacing="xs">
            <Text
              size="xs"
              styles={{
                root: {
                  color: '#737373',
                },
              }}
              weight={500}
            >
              {commentTimeStamps}
            </Text>

            {
              currentUsername && (
                <UnstyledButton
                  onClick={() => {
                    setFieldValue('body', `@${commentAuthorUsername} `);
                    setFieldValue('parentComment', parentCommentId || comment.id);
                    setReplyRecipientUsername(commentAuthorUsername);
                  }}
                  className={classes.activeOpacityLight}
                >
                  <Text
                    size="xs"
                    weight={700}
                    styles={{
                      root: {
                        color: '#737373',
                      },
                    }}
                  >
                    Reply
                  </Text>
                </UnstyledButton>
              )
            }

          </Group>
        </Stack>

        {
          currentUsername && (
            <Group>
              <UnstyledButton className={classes.activeOpacityLight}>
                <IconHeart size={15} />
              </UnstyledButton>

              {
                isCurrentUserTheCommentAuthor && (
                  <>
                    <DeleteModal
                      opened={isDeleteModalOpen}
                      onClose={() => setIsDeleteModalOpen(false)}
                      onDelete={() => deleteComment({
                        postId: comment.post,
                        commentId: comment.id,
                      })}
                      zIndex={1000}
                    />
                    <UnstyledButton
                      className={classes.activeOpacityLight}
                      onClick={() => setIsDeleteModalOpen(true)}
                      data-cy="delete-comment-btn"
                    >
                      <IconTrash size={15} />
                    </UnstyledButton>
                  </>
                )
              }
            </Group>
          )
        }
      </Group>
    );
  }

  return null;
}

Comment.defaultProps = {
  parentCommentId: null,
};

export default Comment;
