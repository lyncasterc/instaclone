import {
  Text,
  Group,
  UnstyledButton,
  Loader,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import useStyles from './comments-captions.styles';
import { useGetRepliesByParentCommentIdQuery } from '../../app/apiSlice';
import { Comment as CommentType } from '../../app/types';
import Comment from './Comment';

interface ParentCommentProps {
  comment: CommentType,
  setReplyRecipientUsername: React.Dispatch<React.SetStateAction<string>>,
}

function ParentComment({ comment, setReplyRecipientUsername }: ParentCommentProps) {
  const { classes } = useStyles();
  const { replies } = comment;
  const [repliesExpanded, setRepliesExpanded] = useState(false);
  const [getReplies, setGetReplies] = useState(false);
  const { data, isLoading, isSuccess } = useGetRepliesByParentCommentIdQuery({
    parentCommentId: comment.id,
    postId: comment.post,
  }, { skip: !getReplies });

  const doesParentCommentHaveReplies = replies && replies.length > 0;

  const onViewRepliesClick = () => {
    if (!getReplies) {
      setGetReplies(true);
    } else {
      setRepliesExpanded(!repliesExpanded);
    }
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      setRepliesExpanded(true);
    }
  }, [isLoading, isSuccess]);

  return (
    <>
      <Comment comment={comment} setReplyRecipientUsername={setReplyRecipientUsername} />
      {
        doesParentCommentHaveReplies && (
          <div className={classes.repliesDividerContainer}>
            <Group spacing={10}>
              <div className={classes.repliesDivider} />
              <UnstyledButton
                onClick={onViewRepliesClick}
              >
                <Text
                  size="xs"
                  weight={700}
                  sx={{
                    color: '#737373',
                  }}
                >
                  {
                    repliesExpanded
                      ? 'Hide all replies'
                      : `View all ${replies.length} replies`
                  }
                </Text>
              </UnstyledButton>
              {
              isLoading ? (
                <Loader color="gray" size={12} />
              ) : null
            }
            </Group>

            <div className={classes.repliesContainer}>
              {
              (repliesExpanded && isSuccess) && data.map((reply) => (
                <Comment
                  comment={reply}
                  key={reply.id}
                  setReplyRecipientUsername={setReplyRecipientUsername}
                  parentCommentId={comment.id}
                />
              ))
            }
            </div>

          </div>
        )
      }
    </>
  );
}

export default ParentComment;
