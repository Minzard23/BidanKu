import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roleYangDiizinkan }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roleYangDiizinkan && !roleYangDiizinkan.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}