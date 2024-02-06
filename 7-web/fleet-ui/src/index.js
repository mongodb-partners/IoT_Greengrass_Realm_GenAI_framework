import React, { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@realm/react';
import { RealmProvider, UserProvider } from '@realm/react';

import 'assets/scss/style.scss';

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { Vehicle } from './models/Vehicle';
import { Job } from './models/Job';
import { Part } from './models/Part';
import { User } from './models/User';

import App from 'layout/App';
import reducer from 'store/reducer';
import reportWebVitals from './registerWebVitals';
import { ATLAS_APP_ID, REALM_BASE_URL } from 'config.js';
import Loadable from 'component/Loadable';

const AuthLogin = Loadable(lazy(() => import('./views/Login')));

const store = configureStore({ reducer });
const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <AppProvider id={ATLAS_APP_ID} baseUrl={REALM_BASE_URL}>
      <UserProvider fallback={AuthLogin}>
        <RealmProvider
          schema={[Vehicle, Part, Job, User]}
          sync={{
            flexible: true,
            initialSubscriptions: {
              update: (mutableSubs, realm) => {
                mutableSubs.add(realm.objects(Vehicle), { name: 'allVehicles' });
                mutableSubs.add(realm.objects(Part), { name: 'allParts' });
                mutableSubs.add(realm.objects(Job), { name: 'allJobs' });
                mutableSubs.add(realm.objects(User), { name: 'allUsers' });
              }
            },
            onError: (err) => console.log(err)
          }}
        >
          <BrowserRouter basename={process.env.REACT_APP_BASE_NAME}>
            <App />
          </BrowserRouter>
        </RealmProvider>
      </UserProvider>
    </AppProvider>
  </Provider>
);

reportWebVitals();
