import is from 'is_js';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import React, { useContext, useEffect, Suspense } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import keys from 'utils/keys';
import MainLayout from './MainLayout';
import AppContext from 'context/Context';
import { getRoutes } from 'routes/routes';
import { CloseButton } from 'components/common/Toast';
import LoadingCenter from 'components/loading/LoadingCenter';

const invalidRoutes = ['/', '/null', '/undefined'];
const Layout = () => {
  const navigate = useNavigate();
  const settings = useSelector(state => state.settings);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const HTMLClassList = document.getElementsByTagName('html')[0].classList;
  useContext(AppContext);
  const { default_route } = settings;
  const defaultRoute = user?.default_route || default_route;

  useEffect(() => {
    if (is.windows()) {
      HTMLClassList.add('windows');
    }
    if (is.chrome()) {
      HTMLClassList.add('chrome');
    }
    if (is.firefox()) {
      HTMLClassList.add('firefox');
    }
  }, [HTMLClassList]);

  const handleRedirect = () => {
    const redirect = localStorage.getItem(keys.REDIRECT);
    const redirectAfterLogin = localStorage.getItem(keys.REDIRECT_AFTER_LOGIN);
    localStorage.removeItem(keys.REDIRECT);
    localStorage.removeItem(keys.REDIRECT_AFTER_LOGIN);
    console.log('Req to redirect: ', redirect);
    console.log('Req to redirect after login: ', redirectAfterLogin);

    if (
      redirectAfterLogin &&
      redirectAfterLogin !== '/' &&
      !redirectAfterLogin.endsWith('/null') &&
      !redirectAfterLogin.endsWith('/undefined') &&
      !redirectAfterLogin.includes('reset-password')
    ) {
      navigate(redirectAfterLogin);
      return;
    }

    if (
      redirect &&
      redirect !== '/' &&
      !redirect.endsWith('/null') &&
      !redirect.endsWith('/undefined') &&
      !redirect.includes('reset-password')
    ) {
      navigate(redirect);
    } else {
      if (defaultRoute && isAuthenticated) {
        navigate(defaultRoute);
      }
    }
  };

  useEffect(() => {
    handleRedirect();
  }, []);

  return (
    <>
      <Suspense
        fallback={
          <LoadingCenter
            simple={true}
            msg="Loading Component..."
            msgColor="inherit"
          />
        }
      >
        <Routes>
          {/* //--- MainLayout Starts  */}
          <Route element={<MainLayout />}>
            {/*Dashboard*/}

            {getRoutes().map((route, index) => {
              return (
                route.component && (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={<route.component />}
                  />
                )
              );
            })}

            {invalidRoutes.map((path, index) => (
              <Route
                key={index + path}
                path={path}
                element={<Navigate to={defaultRoute || '/dashboard'} replace />}
              />
            ))}
          </Route>
          {/* //--- MainLayout end  */}
        </Routes>
      </Suspense>
      <ToastContainer
        closeButton={CloseButton}
        icon={false}
        position={toast.POSITION.BOTTOM_LEFT}
      />
    </>
  );
};

export default Layout;
