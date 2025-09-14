import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../pages/AdminDashboard';
import NgoDashboard from '../pages/NgoDashboard';
import Profile from '../pages/Profile';

const Dashboard = () => {
  const { user, userRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userRole === 'admin') {
    return <AdminDashboard />;
  } else if (userRole === 'ngo') {
    return <NgoDashboard />;
  } else {
    return <Profile user={user} userRole={userRole} />;
  }
};

export default Dashboard;
