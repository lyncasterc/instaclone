import { useParams } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import UserProfileNavbar from './UserProfileNavbar/UserProfileNavbar';
import UserProfileInfo from './UserProfileInfo';
import UserProfileInfoBar from './UserProfileInfoBar/UserProfileInfoBar';
import DesktopNavbar from '../../../common/components/Navbars/DesktopNavbar/DesktopNavbar';
import useAuth from '../../../common/hooks/useAuth';

function UserProfile() {
  const { username } = useParams();
  const [user] = useAuth();
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');

  const isCurrentUserProfile = user !== null && user === username;
  // TODO: add logic for verifying that username exists
  // and then remove type assertion from line 31

  const fakeUser = {
    id: '1',
    username: username ?? 'bob',
    fullName: 'test',
    email: 'test',
    passwordHash: 'test',
  };

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
        user={fakeUser}
        isCurrentUserProfile={isCurrentUserProfile}
        isCurrentUserLoggedIn={user === null}
      />
      {
        !isMediumScreenOrWider && (
          <UserProfileInfoBar
            postCount={1000}
            followerCount={13560}
            followingCount={467003}
          />
        )
      }

    </>
  );
}

export default UserProfile;
