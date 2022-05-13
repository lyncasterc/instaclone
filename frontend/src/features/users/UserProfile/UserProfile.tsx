import { useParams } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import UserProfileNavbar from './UserProfileNavbar/UserProfileNavbar';
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

  const isCurrentUserProfile = user !== null && user === username;
  // TODO: add logic for verifying that username exists
  // and then remove type assertion from line 31

  if (selectedUser) {
    return (
      <>
        {
        user ? (
          <UserProfileNavbar
            username={username as string}
            isCurrentUserProfile={isCurrentUserProfile}
          />
        ) : (
          <DesktopNavbar displayOnMobile />
        )
      }
        <UserProfileInfo
          user={selectedUser}
          isCurrentUserProfile={isCurrentUserProfile}
          isCurrentUserLoggedIn={user === null}
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

      <UserProfileImageGrid />

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
