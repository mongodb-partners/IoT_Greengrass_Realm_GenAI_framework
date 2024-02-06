import React, { Suspense } from 'react';

import Loader from './Loader/Loader';

const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;
