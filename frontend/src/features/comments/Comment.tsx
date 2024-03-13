import {
  Text,
  Group,
  Stack,
  UnstyledButton,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconHeart, IconTrash } from '@tabler/icons-react';
import Avatar from '../../common/components/Avatar/Avatar';
import { Comment as CommentType } from '../../app/types';
import useStyles from './comments-captions.styles';
import { selectUserByUsername } from '../../app/apiSlice';
import { useAppSelector } from '../../common/hooks/selector-dispatch-hooks';
import useAuth from '../../common/hooks/useAuth';
import getTimeSinceDate from '../../common/utils/getTimeSinceDate';
import ViewMoreText from '../../common/components/ViewMoreText/ViewMoreText';

interface CommentProps {
  comment: CommentType,
}

function Comment({ comment }: CommentProps) {
  const { classes } = useStyles();
  const {
    author: { username },
    createdAt,
    body,
  } = comment;
  const user = useAppSelector((state) => selectUserByUsername(state, username));
  const [currentUsername] = useAuth();
  if (user) {
    const commentTimeStamps = getTimeSinceDate(new Date(createdAt), { isCommentFormat: true });
    const isCurrentUserTheCommentAuthor = currentUsername === username;

    return (
      <Group spacing="sm" pb={15} position="apart">
        <Link to={`/users/${username}`} className={classes.avatarLink}>
          <Avatar src={user.image?.url} alt={username} />
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
                to={`/users/${username}`}
                color="black"
                weight={700}
                size="sm"
                className={classes.activeOpacityLight}
              >
                {username}
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
            <Text size="xs">{commentTimeStamps}</Text>

            {
            currentUsername && (
              <UnstyledButton>
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

        <Group>
          <UnstyledButton className={classes.activeOpacityLight}>
            <IconHeart size={15} />
          </UnstyledButton>

          {
          isCurrentUserTheCommentAuthor && (
            <UnstyledButton className={classes.activeOpacityLight}>
              <IconTrash size={15} />
            </UnstyledButton>
          )
        }
        </Group>
      </Group>
    );
  }

  return null;
}

export default Comment;
