import {
  Group,
  Avatar,
  Stack,
  Text,
  Button,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import useStyles from './UsersPreviewList.styles';
import { User } from '../../../app/types';
import { useFollowUserByIdMutation, useUnfollowUserByIdMutation, selectUserByUsername } from '../../../app/apiSlice';
import placeholderIcon from '../../../assets/placeholder-icon.jpeg';
import getErrorMessage from '../../utils/getErrorMessage';
import useAuth from '../../hooks/useAuth';

import { useAppSelector } from '../../hooks/selector-dispatch-hooks';

interface UsersPreviewListProps {
  users: User[];
}

function UsersPreviewList({ users }: UsersPreviewListProps) {
  const { classes, cx } = useStyles();
  const [followUser, { isLoading: isFollowLoading }] = useFollowUserByIdMutation();
  const [unfollowUser, { isLoading: isUnfollowLoading }] = useUnfollowUserByIdMutation();
  const [currentUsername] = useAuth();
  const selectedUser = currentUsername ? useAppSelector(
    (state) => selectUserByUsername(state, currentUsername),
  ) : undefined;

  const renderFollowButton = ({ otherUsername, otherUserId }: {
    otherUsername: string,
    otherUserId: string
  }) => {
    if (
      selectedUser
      && selectedUser.username !== otherUsername
    ) {
      const isCurrentUserFollowing = Boolean(
        selectedUser?.following && selectedUser.following?.map(
          (user) => user.username,
        ).includes(otherUsername),
      );
      const buttonText = isCurrentUserFollowing ? 'Following' : 'Follow';

      const onFollowBtnClick = async () => {
        const followFunc = isCurrentUserFollowing ? unfollowUser : followUser;

        try {
          await followFunc(otherUserId).unwrap();
        } catch (error) {
          console.error(getErrorMessage(error));
        }
      };

      return (
        <Button
          loading={isFollowLoading || isUnfollowLoading}
          data-cy="follow-btn"
          className={classes.followButton}
          onClick={onFollowBtnClick}
        >
          {buttonText}
        </Button>
      );
    }
    return null;
  };

  return (
    <div className={classes.userPreviewContainer}>
      {users.map((user) => (
        <Group key={user.username} position="apart">
          <Link to={`/${user.username}`} className={classes.link}>
            <Group>
              <Avatar
                src={user.image?.url}
                alt={user.username}
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
              <Stack spacing="lg">
                <Text
                  weight={700}
                  size="sm"
                  className={cx(classes.activeOpacityLight, classes.text)}
                  color="black"
                >
                  {user.username}
                </Text>
                <Text className={cx(classes.text, classes.name)}>
                  {user.fullName}
                </Text>
              </Stack>
            </Group>
          </Link>

          {
            renderFollowButton({
              otherUsername: user.username,
              otherUserId: user.id,
            })
          }
        </Group>
      ))}
    </div>
  );
}

export default UsersPreviewList;
