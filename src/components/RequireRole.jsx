import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeFor } from '../lib/roles';

// Route guard: signed-out visitors go to the sign-in page; signed-in users
// without the right role are sent to their own portal.
const RequireRole = ({ roles, children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to={homeFor(user)} replace />;
  return children;
};

export default RequireRole;
