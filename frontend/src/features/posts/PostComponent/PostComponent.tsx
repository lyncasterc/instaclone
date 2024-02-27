/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Avatar, Image, Group, Text,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import {
  IconHeart, IconMessageCircle, IconDots,
} from '@tabler/icons-react';
import useAuth from '../../../common/hooks/useAuth';
import { Post } from '../../../app/types';
import placeholderIcon from '../../../assets/placeholder-icon.jpeg';
import useStyles from './Post.styles';

interface PostProps {
  post: Post,
}

function PostComponent({ post }: PostProps) {
  const [currentUsername] = useAuth();
  const postCreator = post.creator.username;
  const isCurrentUserPostCreator = currentUsername === postCreator;
  const { classes } = useStyles();

  return (
    <>
      <Group
        position="apart"
        className={classes.postCreatorBar}
      >
        <Link
          to={`/${postCreator}`}
          className={classes.postCreatorLink}
        >
          <Group position="center" spacing="sm">
            <Avatar
              src={post.creator.image?.url}
              alt={post.creator.username}
              radius="xl"
              size="md"
            >
              <div>
                <img
                  src={placeholderIcon}
                  alt=""
                  className={classes.placeholderIcon}
                />
              </div>
            </Avatar>
            <Text
              weight={700}
              size="sm"
              className={classes.activeOpacityLight}
            >
              {postCreator}
            </Text>
          </Group>
        </Link>

        <IconDots
          size={20}
          strokeWidth={1.5}
          color="black"
          className={classes.activeOpacityLight}
        />
      </Group>
      <Image
        src={post.image.url}
      />
      <Group
        position="left"
        className={classes.likeCommentContainer}
        spacing="sm"
      >
        <IconHeart
          size={28}
          strokeWidth={1.5}
          color="black"
          className={classes.activeOpacityLight}
        />
        <IconMessageCircle
          size={28}
          strokeWidth={1.5}
          color="black"
          className={classes.activeOpacityLight}
        />
      </Group>
      <div className={classes.createdContainer}>
        <Text size="xs" className={classes.createdAt}>
          {post.createdAt}
        </Text>
      </div>
    </>
  );
}

export default PostComponent;
