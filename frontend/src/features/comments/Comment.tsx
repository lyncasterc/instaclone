/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Text,
  Group,
  Stack,
  UnstyledButton,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconHeart, IconTrash } from '@tabler/icons-react';
import { useFormikContext } from 'formik';
import { useState, useEffect } from 'react';
import Avatar from '../../common/components/Avatar/Avatar';
import { Comment as CommentType } from '../../app/types';
import useStyles from './comments-captions.styles';
import getErrorMessage from '../../common/utils/getErrorMessage';
import {
  selectUserByUsername,
  useDeleteCommentByIdMutation,
  useGetEntityLikeCountByIDQuery,
  useGetHasUserLikedEntityQuery,
  useLikeEntityMutation,
  useUnlikeEntityByIdMutation,
} from '../../app/apiSlice';
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
  const commentId = comment.id;
  const { data: likeCountData } = useGetEntityLikeCountByIDQuery(commentId, {
    refetchOnMountOrArgChange: true,
  });
  const { data: hasUserLikedEntityData } = useGetHasUserLikedEntityQuery(commentId, {
    refetchOnMountOrArgChange: true,
  });
  const [likeEntity] = useLikeEntityMutation();
  const [unlikeEntity] = useUnlikeEntityByIdMutation();
  const hasUserLikedEntity = hasUserLikedEntityData?.hasLiked || false;
  const [hasUserLikedComment, setHasUserLikedComment] = useState(false);
  const [commentLikeCount, setCommentLikeCount] = useState(0);

  const onLikeButtonClick = async () => {
    if (hasUserLikedComment) {
      try {
        await unlikeEntity(commentId).unwrap();
        setHasUserLikedComment(false);
        setCommentLikeCount(commentLikeCount - 1);
      } catch (error) {
        console.error(getErrorMessage(error));
      }
    } else {
      try {
        await likeEntity({
          entityId: commentId,
          entityModel: 'Comment',
        }).unwrap();
        setHasUserLikedComment(true);
        setCommentLikeCount(commentLikeCount + 1);
      } catch (error) {
        console.error(getErrorMessage(error));
      }
    }
  };

  useEffect(() => {
    setHasUserLikedComment(hasUserLikedEntity);
    setCommentLikeCount(likeCountData?.likeCount || 0);
  }, [hasUserLikedEntityData, likeCountData]);

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
              commentLikeCount > 0 && (
                <Text
                  size="xs"
                  weight={700}
                  styles={{
                    root: {
                      color: '#737373',
                    },
                  }}
                  className={classes.activeOpacityLight}
                  component={Link}
                  to={`/p/${comment.post}/c/${comment.id}/liked_by`}
                >
                  {commentLikeCount}
                  {' '}
                  {commentLikeCount === 1 ? 'like' : 'likes'}
                </Text>
              )
            }

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
              <UnstyledButton
                className={classes.activeOpacityLight}
                onClick={onLikeButtonClick}
                data-cy="like-comment-btn"
              >
                <IconHeart
                  size={15}
                  fill={hasUserLikedComment ? 'red' : 'none'}
                  color={hasUserLikedComment ? 'red' : 'black'}
                />
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
