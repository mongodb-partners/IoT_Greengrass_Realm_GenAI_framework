import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { AppProvider, UserProvider } from '@realm/react';


import { LoginScreen } from './screens/LoginScreen';
import { colors } from './styles/colors';
import { AuthApp } from './authApp';

type AppProps = {
  appId: string;
};

export function App({ appId }: AppProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <AppProvider id={appId}>
        <UserProvider fallback={<LoginScreen />}>
          <AuthApp />
        </UserProvider>
      </AppProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
