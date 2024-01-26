import PropTypes from 'prop-types';
import React from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton, Typography } from '@mui/material';

import ProfileSection from './ProfileSection';
import { drawerWidth } from 'config.js';

import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

const Header = ({ drawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      <Box width={drawerWidth}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Grid item>
              <Typography color={'white'} variant="h3">
                Fleet UI
              </Typography>
            </Grid>
          </Box>
          <Grid item>
            <IconButton
              edge="start"
              sx={{ mr: theme.spacing(1.25) }}
              color="inherit"
              aria-label="open drawer"
              onClick={drawerToggle}
              size="large"
            >
              <MenuTwoToneIcon sx={{ fontSize: '1.5rem' }} />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  drawerToggle: PropTypes.func
};

export default Header;
