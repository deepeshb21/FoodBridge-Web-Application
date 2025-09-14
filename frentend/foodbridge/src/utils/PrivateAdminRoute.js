import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateAdminRoute = () => {
  const { user, userRole } = useAuth();

  const isAdmin = user && userRole === 'admin';

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateAdminRoute;
