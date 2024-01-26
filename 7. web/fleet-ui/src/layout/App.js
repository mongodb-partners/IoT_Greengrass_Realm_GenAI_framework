import React from 'react';

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useSelector } from 'react-redux';

import theme from 'themes';
import Routes from 'routes/index';
import NavigationScroll from './NavigationScroll';

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <>
      {
        <NavigationScroll>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme(customization)}>
              <CssBaseline />
              <Routes />
            </ThemeProvider>
          </StyledEngineProvider>
        </NavigationScroll>
      }
    </>
  );
};

export default App;
