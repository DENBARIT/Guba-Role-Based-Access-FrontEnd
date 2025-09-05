
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function HomeRedirect() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until auth state is known
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (!user) {
      // User is still loading, don't redirect yet
      return;
    }

    // Redirect based on role
    if (user.roles.includes('Admin')) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/user-profile', { replace: true });
    }
  }, [user, isAuthenticated, navigate]);

  return (
    <div className="p-6 text-center">
      Redirecting...
    </div>
  );
}
