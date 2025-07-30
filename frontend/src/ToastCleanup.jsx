import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ToastCleanup = () => {
  const location = useLocation();

  useEffect(() => {
const dismissRoutes = ["/login", "/create", "/usermake"];
    if (dismissRoutes.includes(location.pathname)) {
      toast.dismiss();
    }
  }, [location.pathname]);

  return null; // No UI, just logic
};
export default ToastCleanup;