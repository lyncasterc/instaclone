import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import Damion from '../common/components/Damion';
import GlobalStyles from '../common/components/GlobalStyles';
import Login from '../features/auth/Login';
import SignUp from '../features/users/SignUp';
import Home from '../features/users/Home/Home';
import RequireAuth from '../features/auth/RequireAuth';
import useAuth from '../common/hooks/useAuth';
import DesktopNavbar from '../common/components/Navbars/DesktopNavbar/DesktopNavbar';
import BottomNavBar from '../common/components/Navbars/BottomNavbar/BottomNavbar';
import UserProfile from '../features/users/UserProfile/UserProfile';
import EditPostDetails from '../features/posts/EditPostDetails/EditPostDetails';
import UserProfileEdit from '../features/users/UserProfile/UserProfileEdit/UserProfileEdit';
import Test from '../test';
import EditPostImage from '../features/posts/EditPostImage/EditPostImage';
import Alert from '../common/components/Alert/Alert';

interface LocationState {
  background: string,
}

function App() {
  const [user] = useAuth();
  const location = useLocation();
  const [alertText, setAlertText] = useState('');
  const isCreatePage = /create/i.test(location.pathname);
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
            <DesktopNavbar />
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
              <Home />
            </RequireAuth>
        )}
        />
        <Route path="/login" element={user ? <Home /> : <Login />} />
        <Route path="/signup" element={user ? <Home /> : <SignUp />} />
        <Route path="/:username" element={<UserProfile />} />
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
        {/* TODO: add post view route here when not on desktop */}
      </Routes>

      {/* TODO: replace <Test> with real modal image component */}
      {
        background && isMediumScreenOrWider && (
          <Routes>
            <Route path="/p/:postId" element={<Test />} />
          </Routes>
        )
      }
    </>
  );
}

export default App;
