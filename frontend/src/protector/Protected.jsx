import { Navigate } from 'react-router-dom';
import { useAutho } from './useAuth';

const Protected = ({ children }) => {
  const { user } = useAutho();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
