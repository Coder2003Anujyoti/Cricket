import { Navigate } from 'react-router-dom';
import { useAutho } from './useAuth';
const get_role=()=>{
  return JSON.parse(sessionStorage.getItem("role"))
}
const Protected = ({ children,allowedRoles=[]}) => {
 const role=get_role()
  const { user } = useAutho();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles.length >0 && !allowedRoles.includes(role)) return <Navigate to="/unauthorize" />;

  return children;
};

export default Protected;
