import React from 'react';
import { Navigate } from 'react-router-dom';

const DonateRedirect = ({ user }) => {
  if (!user) {
    return <Navigate to="/register" />;
  } else {
    return <Navigate to="/donate" />;
  }
};

export default DonateRedirect;

