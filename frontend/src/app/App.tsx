import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import Damion from '../common/components/Damion';
import GlobalStyles from '../common/components/GlobalStyles';
import Login from '../features/auth/Login';
import SignUp from '../features/users/SignUp';
import Home from '../features/posts/Home/Home';
import RequireAuth from '../features/auth/RequireAuth';
import useAuth from '../common/hooks/useAuth';
import DesktopNavbar from '../common/components/Navbars/DesktopNavbar/DesktopNavbar';
import BottomNavBar from '../common/components/Navbars/BottomNavbar/BottomNavbar';
import UserProfile from '../features/users/UserProfile/UserProfile';
import EditPostDetails from '../features/posts/EditPostDetails/EditPostDetails';
import UserProfileEdit from '../features/users/UserProfile/UserProfileEdit/UserProfileEdit';
import EditPostImage from '../features/posts/EditPostImage/EditPostImage';
import Alert from '../common/components/Alert/Alert';
import PostView from '../features/posts/PostView/PostView';
import MobileHomeNavBar from '../common/components/Navbars/MobileHomeNavbar/MobileHomeNavbar';
import FollowingFollowersView from '../features/users/FollowingFollowersView/FollowingFollowersView';
import CommentsView from '../features/comments/CommentsView/CommentsView';
import LikedByView from '../features/users/LikedByView/LikedByView';

interface LocationState {
  background: string,
}

function App() {
  const [user] = useAuth();
  const location = useLocation();
  const [alertText, setAlertText] = useState('');
  const isCreatePage = /create/i.test(location.pathname);
  const isHomePage = location.pathname === '/';
  const state = location.state as LocationState;
  const background = state && state.background;
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');

  return (
    <>
      <GlobalStyles />
      <Damion />

      {
        alertText && (
          <Alert
            alertText={alertText}
            setAlertText={setAlertText}
          />
        )
      }

      {
        user && (
          <>
            {
              isMediumScreenOrWider ? (
                <DesktopNavbar />
              ) : (
                isHomePage && <MobileHomeNavBar />
              )
            }
            {!isCreatePage && (
              <BottomNavBar user={user} />
            )}
          </>
        )
      }
      <Routes location={background || location}>
        <Route
          path="/"
          element={(
            <RequireAuth>
              <Home setAlertText={setAlertText} />
            </RequireAuth>
        )}
        />
        <Route path="/login" element={user ? <Home setAlertText={setAlertText} /> : <Login />} />
        <Route path="/signup" element={user ? <Home setAlertText={setAlertText} /> : <SignUp />} />
        <Route path="/:username" element={<UserProfile />} />
        <Route path="/:username/followers" element={<FollowingFollowersView />} />
        <Route path="/:username/following" element={<FollowingFollowersView />} />
        <Route
          path="/create/edit"
          element={(
            <RequireAuth>
              <EditPostImage setAlertText={setAlertText} />
            </RequireAuth>
        )}
        />
        <Route
          path="/create/details"
          element={(
            <RequireAuth>
              <EditPostDetails username={user!} setAlertText={setAlertText} />
            </RequireAuth>
        )}
        />
        <Route
          path="/accounts/edit"
          element={(
            <RequireAuth>
              <UserProfileEdit user={user} />
            </RequireAuth>
        )}
        />
        <Route path="/p/:postId" element={<PostView setAlertText={setAlertText} />} />
        <Route path="/p/:postId/comments" element={<CommentsView />} />
        <Route path="/p/:postId/liked_by" element={<LikedByView entityModel="Post" />} />
        <Route path="/p/:postId/c/:commentId/liked_by" element={<LikedByView entityModel="Comment" />} />
      </Routes>
    </>
  );
}

export default App;
