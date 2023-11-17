import React, { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';

const Vehicle = Loadable(lazy(() => import('../views/Vehicle')));
const Part = Loadable(lazy(() => import('../views/Part')));
const Job = Loadable(lazy(() => import('../views/Job')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Job />
    },
    { path: '/jobs', element: <Job /> },
    { path: '/vehicles', element: <Vehicle /> },
    { path: '/parts', element: <Part /> }
  ]
};

export default MainRoutes;
