// import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Damion from '../common/components/Damion';
import GlobalStyles from '../common/components/GlobalStyles';
import Login from '../features/auth/Login';
import SignUp from '../features/users/SignUp';
import Home from '../features/users/Home';
import RequireAuth from '../features/auth/RequireAuth';
import useAuth from '../common/hooks/useAuth';

function App() {
  const [user] = useAuth();
  return (
    <>
      <GlobalStyles />
      <Damion />

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
