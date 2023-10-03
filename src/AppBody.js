import React from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PublicRoute from 'widgets/PublicRoute';
import PrivateRoute from 'widgets/PrivateRoute';
import AuthSimpleLayout from 'layouts/AuthSimpleLayout';
import LoadingCenter from 'components/loading/LoadingCenter';
// import AddMember from 'components/members/AddMember';

const OTP = React.lazy(() => import('./screens/OTP'));
const Login = React.lazy(() => import('./screens/Login'));
const Layout = React.lazy(() => import('./layouts/Layout'));
const ResetPassword = React.lazy(() => import('./screens/ResetPassword'));
const ForgotPassword = React.lazy(() => import('./screens/ForgotPassword'));

function AppBody() {
  const settings = useSelector(state => state.settings);
  const { currentModule } = useSelector(state => state.theme);
  const { title, favicon_16ISfile, favicon_32ISfile, favicon_192ISfile } =
    settings || {};
  return (
    <>
      <Helmet>
        <title>{`${title}${currentModule && ` - ${currentModule}`}`}</title>
        {favicon_16ISfile?.uri && (
          <link
            rel="icon"
            type={favicon_16ISfile.type || 'image/png'}
            href={favicon_16ISfile.uri}
            sizes="16x16"
          />
        )}
        {favicon_32ISfile?.uri && (
          <link
            rel="icon"
            type={favicon_32ISfile.type || 'image/png'}
            href={favicon_32ISfile.uri}
            sizes="32x32"
          />
        )}
        {favicon_192ISfile?.uri && (
          <link
            rel="icon"
            type={favicon_192ISfile.type || 'image/png'}
            href={favicon_192ISfile.uri}
            sizes="192x192"
          />
        )}
      </Helmet>
      <Router basename={process.env.PUBLIC_URL}>
        <React.Suspense
          fallback={
            <LoadingCenter
              simple={true}
              msg="Loading Component..."
              msgColor="inherit"
            />
          }
        >
          <Routes>
            {/* Public */}
            <Route element={<AuthSimpleLayout />}>
              <Route element={<PublicRoute />}>
                <Route exact path="login" name="Login" element={<Login />} />
                <Route exact path="otp" name="OTP" element={<OTP />} />
                <Route
                  exact
                  path="forgot-password"
                  name="Request Password Reset Link"
                  element={<ForgotPassword />}
                />
              </Route>

              <Route
                exact
                path="reset-password"
                name="Password Reset"
                element={<ResetPassword />}
              />
            </Route>

            {/* Private */}
            <Route element={<PrivateRoute />}>
              <Route name="Home" path="*" element={<Layout />} />
            </Route>
          </Routes>
        </React.Suspense>
      </Router>
    </>
  );
}

export default AppBody;
