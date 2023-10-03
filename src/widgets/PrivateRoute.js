import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const auth = useSelector(state => state.auth);
  const settings = useSelector(state => state.settings);

  const { login_url } = settings || {};

  if (auth.isAuthenticated === false && login_url) {
    window.location.href = login_url;
    return null;
  }

  return auth.isAuthenticated === true ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
