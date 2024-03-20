import { Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import useAuth from '../../../../../common/hooks/useAuth';
import {
  useFollowUserByIdMutation,
  useUnfollowUserByIdMutation,
} from '../../../../../app/apiSlice';
import getErrorMessage from '../../../../../common/utils/getErrorMessage';
import useStyles from './UserProfileInfoButtons.styles';

interface UserProfileInfoButtonsProps {
  userId: string;
  isCurrentUserProfile?: boolean;
  isCurrentUserFollowing: boolean;
}

function UserProfileInfoButtons({
  userId,
  isCurrentUserProfile,
  isCurrentUserFollowing,
}: UserProfileInfoButtonsProps) {
  const [user] = useAuth();
  const { classes, cx } = useStyles();
  const isCurrentUserLoggedIn = user != null;
  const [followUser, { isLoading: isFollowLoading }] = useFollowUserByIdMutation();
  const [unfollowUser, { isLoading: isUnfollowLoading }] = useUnfollowUserByIdMutation();

  const onFollowBtnClick = async () => {
    const followFunc = isCurrentUserFollowing ? unfollowUser : followUser;

    try {
      await followFunc(userId).unwrap();
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  };

  if (isCurrentUserProfile) {
    return (
      <Button
        classNames={{
          root: cx(classes.buttonRoot, classes.editButtonRoot),
          outline: classes.buttonOutline,
        }}
        variant="outline"
        component={Link}
        to="/accounts/edit"
      >
        Edit Profile
      </Button>
    );
  }

  if (isCurrentUserLoggedIn) {
    return (
      <div className={classes.mainSectionButtonGroup}>
        <Button
          classNames={{
            root: classes.buttonRoot,
            outline: classes.buttonOutline,
          }}
          variant="outline"
        >
          Message
        </Button>
        <Button
          classNames={{
            root: cx(classes.buttonRoot, classes.followButtonRoot),
          }}
          onClick={onFollowBtnClick}
          loading={isFollowLoading || isUnfollowLoading}
          data-cy="follow-btn"
        >
          {isCurrentUserFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>
    );
  }

  return null;
}

UserProfileInfoButtons.defaultProps = {
  isCurrentUserProfile: false,
};

export default UserProfileInfoButtons;
