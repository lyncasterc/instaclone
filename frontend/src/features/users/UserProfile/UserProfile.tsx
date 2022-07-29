import { useParams } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
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
