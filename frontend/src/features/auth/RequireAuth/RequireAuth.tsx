import { useLocation, Navigate } from 'react-router-dom';
import { ReactElement } from 'react';
import useAuth from '../../../common/hooks/useAuth';

function RequireAuth({ children }: { children: ReactElement }) {
  const [user] = useAuth();
  const location = useLocation();

  return user ? (children) : (<Navigate to="/login" state={{ path: location.pathname }} />);
}

export default RequireAuth;
