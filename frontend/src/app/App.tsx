import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { Container, Loader } from '@mantine/core';
import Damion from '../common/components/Damion';
import GlobalStyles from '../common/components/GlobalStyles';
import Login from '../features/auth/Login/Login';
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
import { usePrefetch } from './apiSlice';

interface LocationState {
  background: string,
}

function App() {
  const [user, { refreshAccessToken }] = useAuth();
  const location = useLocation();
  const [alertText, setAlertText] = useState('');
  const isCreatePage = /create/i.test(location.pathname);
  const isHomePage = location.pathname === '/';
  const state = location.state as LocationState;
  const background = state && state.background;
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');
  const [loading, setLoading] = useState(true);
  const prefetchUsers = usePrefetch('getUsers', { force: true });

  useEffect(() => {
    let isCancelled = false;

    (async () => {
      setLoading(true);
      await refreshAccessToken();
      prefetchUsers();
      if (!isCancelled) {
        setLoading(false);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <Container
        sx={() => ({
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Loader size={80} variant="dots" data-testid="app-loader" />
      </Container>
    );
  }

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
