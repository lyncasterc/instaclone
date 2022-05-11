import {
  Routes,
  Route,
} from 'react-router-dom';
// import { Container } from '@mantine/core';
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

function App() {
  const [user] = useAuth();
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

      <Routes>
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
      </Routes>
    </>
  );
}

export default App;
