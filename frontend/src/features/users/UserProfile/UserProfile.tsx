import { useParams } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect } from 'react';
import GoBackNavbar from '../../../common/components/Navbars/GoBackNavbar/GoBackNavbar';
import UserProfileInfo from './UserProfileInfo';
import UserProfileInfoBar from './UserProfileInfoBar/UserProfileInfoBar';
import UserProfileImageGrid from './UserProfileImageGrid/UserProfileImageGrid';
import DesktopNavbar from '../../../common/components/Navbars/DesktopNavbar/DesktopNavbar';
import useAuth from '../../../common/hooks/useAuth';
import { selectUserByUsername } from '../../../app/apiSlice';
import { useAppSelector } from '../../../common/hooks/selector-dispatch-hooks';

function UserProfile() {
  const { username } = useParams();
  const [user] = useAuth();
  const selectedUser = username ? useAppSelector(
    (state) => selectUserByUsername(state, username),
  ) : undefined;
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');
  const isCurrentUserProfile = user != null && user === username;
  const isCurrentUserFollowing = Boolean(
    user
    && !isCurrentUserProfile
    && selectedUser?.followers
    && selectedUser.followers.find((follower) => follower.username === user) != null,
  );

  useEffect(() => {
    if (selectedUser) {
      document.title = `${selectedUser.fullName} (@${username}) • Instaclone`;
    } else {
      document.title = 'Page Not Found • Instaclone';
    }
  }, [selectedUser, username]);

  if (selectedUser) {
    return (
      <>
        {
        user ? (
          <GoBackNavbar
            text={username as string}
            isCurrentUserProfile={isCurrentUserProfile}
          />
        ) : (
          <DesktopNavbar displayOnMobile />
        )
      }
        <UserProfileInfo
          user={selectedUser}
          isCurrentUserProfile={isCurrentUserProfile}
          isCurrentUserLoggedIn={user != null}
          isCurrentUserFollowing={isCurrentUserFollowing}
        />
        {
          !isMediumScreenOrWider && (
            <UserProfileInfoBar
              postCount={selectedUser.posts?.length ?? 0}
              followerCount={selectedUser.followers?.length ?? 0}
              followingCount={selectedUser.following?.length ?? 0}
            />
          )
        }

        <UserProfileImageGrid posts={selectedUser.posts ?? []} />

      </>
    );
  }

  return (
    <>
      Sorry, this page isn&apos;t available.
    </>
  );
}

export default UserProfile;
