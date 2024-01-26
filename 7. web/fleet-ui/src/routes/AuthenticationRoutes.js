import React from 'react';
import { lazy } from 'react';

import Loadable from 'component/Loadable';
const AuthLogin = Loadable(lazy(() => import('../views/Login')));

const AuthenticationRoutes = {
  path: '/',
  children: [
    {
      path: '/application/login',
      element: <AuthLogin />
    }
  ]
};

export default AuthenticationRoutes;
