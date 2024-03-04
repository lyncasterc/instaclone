import {
  Avatar,
  Image,
  Group,
  Text,
  Modal,
  UnstyledButton,
  Stack,
} from '@mantine/core';
import { Link } from 'react-router-dom';
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

interface PostProps {
  post: Post,
  setAlertText: React.Dispatch<React.SetStateAction<string>>
}

function PostComponent({ post, setAlertText }: PostProps) {
  const [currentUsername] = useAuth();
  const postCreator = post.creator.username;
  const isCurrentUserPostCreator = currentUsername === postCreator;
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const { classes } = useStyles();
  const goBack = useGoBack();
  const [deletePost] = useDeletePostByIdMutation();

  const onDelete = async () => {
    try {
      setDeleteConfirmModalOpen(false);
      await deletePost(post.id).unwrap();
      setAlertText('Post deleted');
      goBack();
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  };

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

        {
          isCurrentUserPostCreator && (
            <IconDots
              size={20}
              strokeWidth={1.5}
              color="black"
              className={classes.activeOpacityLight}
              onClick={() => setDeleteModalOpen(true)}
              data-cy="post-options-btn"
            />
          )
        }
        {/* First delete modal */}
        <Modal
          onClose={() => setDeleteModalOpen(false)}
          opened={isDeleteModalOpen}
          classNames={{
            modal: classes.modal,
          }}
          withCloseButton={false}
          padding={0}
          centered
        >
          <UnstyledButton
            className={classes.modalBtn}
            onClick={() => {
              setDeleteModalOpen(false);
              setDeleteConfirmModalOpen(true);
            }}
          >
            Delete
          </UnstyledButton>
          <UnstyledButton
            className={classes.modalBtn}
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </UnstyledButton>
        </Modal>

        {/* Second delete modal */}
        <Modal
          onClose={() => setDeleteConfirmModalOpen(false)}
          opened={isDeleteConfirmModalOpen}
          classNames={{
            modal: classes.modal,
          }}
          withCloseButton={false}
          padding={0}
          centered
        >
          <Stack p={25} spacing={0}>

            <Text
              weight={600}
              color="black"
              size="xl"
              align="center"
            >
              Delete Post?
            </Text>
            <Text
              size="sm"
              color="gray"
              align="center"
            >
              Are you sure you want to delete this post?
            </Text>

          </Stack>
          <UnstyledButton className={classes.modalBtn} onClick={onDelete} data-cy="confirm-delete-post-btn">
            Delete
          </UnstyledButton>
          <UnstyledButton
            className={classes.modalBtn}
            onClick={() => setDeleteConfirmModalOpen(false)}
          >
            Cancel
          </UnstyledButton>
        </Modal>

      </Group>
      <Image
        src={post.image.url}
        data-cy="post-image"
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
          {getTimeSinceDate(new Date(post.createdAt))}
        </Text>
      </div>
    </>
  );
}

export default PostComponent;
