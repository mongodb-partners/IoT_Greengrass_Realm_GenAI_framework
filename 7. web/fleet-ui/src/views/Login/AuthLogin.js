import React from 'react';
import { useApp, useEmailPasswordAuth } from '@realm/react';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import { Box, Button, FormHelperText, TextField, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AuthLogin = () => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const atlasApp = useApp();
  const { logIn, result } = useEmailPasswordAuth();

  useEffect(() => {}, [result.operation, result.success]);

  // The `currentUser` will be set after a successful login.
  if (atlasApp.currentUser) {
    return <Navigate to="/vehicles" />;
  }

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={(values) => {
          logIn({ email: values?.email, password: values?.password });
        }}
      >
        {({ errors, handleBlur, handleChange, touched, values }) => (
          <Form noValidate>
            <TextField
              error={Boolean(touched.email && errors.email)}
              fullWidth
              helperText={touched.email && errors.email}
              label="Email Address / Username"
              margin="normal"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
              variant="outlined"
            />

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}>
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text">
                  {' '}
                  {errors.password}{' '}
                </FormHelperText>
              )}
            </FormControl>

            {errors.submit && (
              <Box mt={3}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box mt={2}>
              <Button style={{ background: '#00684A' }} fullWidth size="large" type="submit" variant="contained">
                Log In
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
