import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ToastCleanup = () => {
  const location = useLocation();

  useEffect(() => {
    // Dismiss all toasts whenever the route changes
    toast.dismiss();
  }, [location.pathname]);

  return null; // No UI, just logic
};