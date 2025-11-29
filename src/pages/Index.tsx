import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const Index = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'manager' ? '/manager/dashboard' : '/dashboard'} replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;
