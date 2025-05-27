import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { user, admin } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
