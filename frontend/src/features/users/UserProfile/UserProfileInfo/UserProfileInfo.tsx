import { useState } from 'react';
import {
  Avatar,
  Text,
  Container,
  UnstyledButton,
  Loader,
  Group,
  Popover,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDots } from '@tabler/icons-react';
import useStyles from './UserProfileInfo.styles';
import { User } from '../../../../app/types';
import UserProfileInfoBar from '../UserProfileInfoBar/UserProfileInfoBar';
import useUserProfileImageUpload from '../../../../common/hooks/useUserProfileImageUpload';
import placeholderIcon from '../../../../assets/placeholder-icon.jpeg';
import ChangeAvatarModal from '../UserProfileEdit/ChangeAvatarModal/ChangeAvatarModal';
import Alert from '../../../../common/components/Alert/Alert';
import UserProfileInfoButtons from './UserProfileInfoButtons/UserProfileInfoButtons';
import useAuth from '../../../../common/hooks/useAuth';

interface UserProfileInfoProps {
  user: User;
  isCurrentUserProfile?: boolean;
  isCurrentUserFollowing: boolean;
}

interface UserProfileBioNameProps {
  fullName: string;
  bio?: string;
}

function UserProfileBioName({ fullName, bio }: UserProfileBioNameProps) {
  return (
    <div style={{ whiteSpace: 'pre-wrap' }}>
      <Text weight={600}>{fullName}</Text>
      {
        bio && (
          <Text>
            {bio}
          </Text>
        )
      }
    </div>
  );
}

UserProfileBioName.defaultProps = {
  bio: '',
};

/**
 * Component that displays the user's profile image, username, and bio
 * (top section above the user's posts in the user profile page)
 */
function UserProfileInfo({
  user,
  isCurrentUserProfile,
  isCurrentUserFollowing,
}: UserProfileInfoProps) {
  const { classes } = useStyles();
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');
  const [alertText, setAlertText] = useState('');
  const [
    handleFileInputChange,
    onRemoveBtnClick,
    {
      isDeleting, isImageUpdating, modalOpened, setModalOpened,
    },
  ] = useUserProfileImageUpload(setAlertText);
  const [isLogoutPopoverOpen, setIsLogoutPopoverOpen] = useState(false);
  const [, { logout }] = useAuth();

  return (
    <>
      {alertText && !modalOpened && (
        <Alert alertText={alertText} setAlertText={setAlertText} />
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
              <Group position="apart" px="md">
                <Text className={classes.mainSectionUsername}>
                  {user.username}
                </Text>

                {
                  (isCurrentUserProfile && !isMediumScreenOrWider) && (
                    <Popover
                      opened={isLogoutPopoverOpen}
                      onClose={() => setIsLogoutPopoverOpen(false)}
                      target={(
                        <IconDots
                          size={20}
                          onClick={() => setIsLogoutPopoverOpen(!isLogoutPopoverOpen)}
                          data-testid="user-profile-info-dots"
                        />
                  )}
                      position="left"
                      spacing="xs"
                    >
                      <UnstyledButton
                        onClick={
                          async () => {
                            await logout();
                          }
                        }
                      >
                        <Text color="red" size="sm">Log out</Text>
                      </UnstyledButton>
                    </Popover>
                  )
                }

              </Group>
              <UserProfileInfoButtons
                isCurrentUserProfile={isCurrentUserProfile}
                isCurrentUserFollowing={isCurrentUserFollowing}
                userId={user.id}
              />
            </div>
            {isMediumScreenOrWider && (
              <>
                <UserProfileInfoBar
                  postCount={user.posts?.length ?? 0}
                  followerCount={user.followers?.length ?? 0}
                  followingCount={user.following?.length ?? 0}
                />
                <UserProfileBioName
                  fullName={user.fullName}
                  bio={user.bio}
                />
              </>
            )}
          </div>
        </div>

        {!isMediumScreenOrWider && (
          <UserProfileBioName
            fullName={user.fullName}
            bio={user.bio}
          />
        )}
      </Container>
    </>
  );
}

UserProfileInfo.defaultProps = {
  isCurrentUserProfile: false,
};

export default UserProfileInfo;
