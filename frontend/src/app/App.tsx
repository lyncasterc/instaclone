import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
// import { Container } from '@mantine/core';
import Damion from '../common/components/Damion';
import GlobalStyles from '../common/components/GlobalStyles';
import Login from '../features/auth/Login';
import SignUp from '../features/users/SignUp';
import Home from '../features/users/Home/Home';
import RequireAuth from '../features/auth/RequireAuth';
import useAuth from '../common/hooks/useAuth';
import DesktopNavbar from '../common/components/DesktopNavbar/DesktopNavbar';
import BottomNavBar from '../common/components/BottomNavBar/BottomNavbar';

function App() {
  const [user] = useAuth();
  const location = useLocation();
  return (
    <>
      <GlobalStyles />
      <Damion />
      {
        !(/\/signup|\/login/.test(location.pathname)) && (
          <>
            <DesktopNavbar />
            <BottomNavBar />
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
      </Routes>
    </>
  );
}

export default App;
