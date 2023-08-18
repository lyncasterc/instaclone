import { useState } from 'react';
import {
  Avatar,
  Text,
  Container,
  Button,
  UnstyledButton,
  Loader,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import useStyles from './UserProfileInfo.styles';
import { User } from '../../../app/types';
import UserProfileInfoBar from './UserProfileInfoBar/UserProfileInfoBar';
import useUserProfileImageUpload from '../../../common/hooks/useUserProfileImageUpload';
import placeholderIcon from '../../../assets/placeholder-icon.jpeg';
import ChangeAvatarModal from './UserProfileEdit/ChangeAvatarModal/ChangeAvatarModal';
import UserProfileAlert from './UserProfileAlert/UserProfileAlert';

interface UserProfileInfoProps {
  user: User;
  isCurrentUserLoggedIn: boolean;
  isCurrentUserProfile?: boolean;
}

/**
 * Component that displays the user's profile image, username, and bio
 * (top section above the user's posts in the user profile page)
 */
function UserProfileInfo({
  user,
  isCurrentUserProfile,
  isCurrentUserLoggedIn,
}: UserProfileInfoProps) {
  const { classes, cx } = useStyles();
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');
  const [alertText, setAlertText] = useState('');
  const [
    handleFileInputChange,
    onRemoveBtnClick,
    {
      isDeleting, isImageUpdating, modalOpened, setModalOpened,
    },
  ] = useUserProfileImageUpload(setAlertText);
  const buttons = () => {
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
            component={Link}
            to="/"
          >
            Message
          </Button>
          <Button
            classNames={{
              root: cx(classes.buttonRoot, classes.followButtonRoot),
            }}
            component={Link}
            to="/"
          >
            Follow
          </Button>
        </div>
      );
    }

    return null;
  };

  const bio = () => (
    <div style={{ whiteSpace: 'pre-wrap' }}>
      <Text weight={600}>{user.fullName}</Text>
      <Text>
        {user.bio}
      </Text>
    </div>
  );

  return (
    <>
      {alertText && !modalOpened && (
        <UserProfileAlert alertText={alertText} setAlertText={setAlertText} />
      )}

      <ChangeAvatarModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        handleFileInputChange={(e) => handleFileInputChange(e, user.id)}
        setModalOpened={setModalOpened}
        onRemoveBtnClick={() => onRemoveBtnClick(user.id)}
      />

      <Container size="md" className={classes.container}>
        <div className={classes.mainSection}>
          <UnstyledButton
            onClick={() => (user.image && isCurrentUserProfile) && setModalOpened(true)}
            data-testid="profile-info-avatar"
          >
            <label htmlFor="imageUpload">
              <div className={classes.loadingAvatar}>
                <Avatar
                  src={user.image?.url}
                  radius="xl"
                  classNames={{
                    root: classes.avatarRoot,
                  }}
                >
                  <div data-testid="avatar-image">
                    <img
                      src={placeholderIcon}
                      alt={`${user.username}'s profile`}
                      className={classes.placeholderIcon}
                    />
                  </div>
                </Avatar>
                {
                  (isImageUpdating || isDeleting) && (
                    <Loader
                      className={classes.loader}
                      color="gray"
                      sx={{
                        opacity: isImageUpdating ? 1 : 0.5,
                      }}
                    />
                  )
                }
              </div>
            </label>
            {
              (!user.image && isCurrentUserProfile) && (
                <input
                  type="file"
                  name="image"
                  id="imageUpload"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileInputChange(e, user.id)}
                  accept="image/gif, image/png, image/jpeg"
                />
              )
            }
          </UnstyledButton>

          <div className={classes.mainSectionRight}>
            <div className={classes.mainSectionNameBtns}>
              <Text className={classes.mainSectionUsername}>
                {user.username}
              </Text>
              {buttons()}
            </div>
            {isMediumScreenOrWider && (
              <>
                <UserProfileInfoBar
                  postCount={user.posts?.length ?? 0}
                  followerCount={user.followers?.length ?? 0}
                  followingCount={user.following?.length ?? 0}
                />
                {bio()}
              </>
            )}
          </div>
        </div>

        {!isMediumScreenOrWider && bio()}
      </Container>
    </>
  );
}

UserProfileInfo.defaultProps = {
  isCurrentUserProfile: false,
};

export default UserProfileInfo;
