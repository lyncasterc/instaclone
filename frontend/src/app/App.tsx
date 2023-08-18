import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
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
import UserProfileEdit from '../features/users/UserProfile/UserProfileEdit/UserProfileEdit';
import Test from '../test';

interface LocationState {
  background: string,
}

function App() {
  // TODO: pass down user as props to components that need it?
  const [user] = useAuth();
  const location = useLocation();
  const state = location.state as LocationState;
  const background = state && state.background;
  const isMediumScreenOrWider = useMediaQuery('(min-width: 992px)');

  return (
    <>
      <GlobalStyles />
      <Damion />

      {
        user && (
          <>
            <DesktopNavbar />
            <BottomNavBar user={user} />
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
