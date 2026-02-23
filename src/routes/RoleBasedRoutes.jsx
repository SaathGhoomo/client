import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function UserOnlyRoute({ children }) {
  const { user } = useAuth();

  if (user?.role !== 'user') {
    return <Navigate to="/dashboard" replace />;
  }

  return children != null ? <>{children}</> : <Outlet />;
}

export function AdminOnlyRoute({ children }) {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children != null ? <>{children}</> : <Outlet />;
}
