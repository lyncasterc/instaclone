/* eslint-disable max-len */
import {
  Avatar,
  Image,
  Group,
  Text,
} from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  IconHeart, IconMessageCircle, IconDots,
} from '@tabler/icons-react';
import useAuth from '../../../common/hooks/useAuth';
import { Post } from '../../../app/types';
import placeholderIcon from '../../../assets/placeholder-icon.jpeg';
import useStyles from './PostComponent.styles';
import getTimeSinceDate from '../../../common/utils/getTimeSinceDate';
import { useDeletePostByIdMutation } from '../../../app/apiSlice';
import useGoBack from '../../../common/hooks/useGoBack';
import getErrorMessage from '../../../common/utils/getErrorMessage';
import DeleteModal from '../../../common/components/DeleteModal/DeleteModal';

interface PostProps {
  post: Post,
  setAlertText: React.Dispatch<React.SetStateAction<string>>
}

function PostComponent({ post, setAlertText }: PostProps) {
  const [currentUsername] = useAuth();
  const postCreator = post.creator.username;
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isCurrentUserPostCreator = currentUsername === postCreator;
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const { classes, cx } = useStyles();
  const goBack = useGoBack();
  const [deletePost] = useDeletePostByIdMutation();
  const postCommentsLength = post.comments ? post.comments.length : 0;

  const onDelete = async () => {
    try {
      setDeleteConfirmModalOpen(false);
      await deletePost(post.id).unwrap();
      setAlertText('Post deleted');

      if (!isHomePage) {
        goBack();
      }
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  };

  return (
    <div className={classes.postContainer}>
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

        {
          isCurrentUserPostCreator && (
            <IconDots
              size={20}
              strokeWidth={1.5}
              color="black"
              className={classes.activeOpacityLight}
              onClick={() => setDeleteModalOpen(true)}
              data-cy="post-options-btn"
              style={{ cursor: 'pointer' }}
            />
          )
        }
        {/* First delete modal */}
        <DeleteModal
          onClose={() => setDeleteModalOpen(false)}
          opened={isDeleteModalOpen}
          onDelete={() => {
            setDeleteModalOpen(false);
            setDeleteConfirmModalOpen(true);
          }}
          zIndex={1000}
        />

        {/* Second delete modal */}

        <DeleteModal
          onClose={() => setDeleteConfirmModalOpen(false)}
          opened={isDeleteConfirmModalOpen}
          onDelete={onDelete}
          primaryLabel="Delete Post?"
          secondaryLabel="Are you sure you want to delete this post?"
          zIndex={1000}
        />

      </Group>
      <Image
        src={post.image.url}
        data-cy="post-image"
      />
      <div className={classes.postBottomSection}>
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
          <Link to={`/p/${post.id}/comments`} data-cy="comments-link">
            <IconMessageCircle
              size={28}
              strokeWidth={1.5}
              color="black"
              className={classes.activeOpacityLight}
            />
          </Link>
        </Group>
        {
        post.caption && (
          <div>
            <Text
              weight={700}
              size="sm"
              className={cx(classes.activeOpacityLight, classes.captionCreatorLink)}
              component={Link}
              to={`/${postCreator}`}
            >
              {postCreator}
            </Text>
            <Text
              size="sm"
              className={classes.captionText}
            >
              {post.caption}
            </Text>
          </div>
        )
      }

        {
        postCommentsLength > 0 && (
          <Text
            size="sm"
            className={cx(classes.activeOpacityLight, classes.commentsLink)}
            component={Link}
            to={`/p/${post.id}/comments`}
          >
            View all
            {' '}
            {postCommentsLength}
            {' '}
            comments
          </Text>
        )
      }

        <div>
          <Text size="xs" className={classes.createdAt}>
            {getTimeSinceDate(new Date(post.createdAt))}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default PostComponent;
