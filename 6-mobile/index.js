import 'react-native-get-random-values';
import React from 'react';
import { AppRegistry } from 'react-native';

import { App } from './app/app';
import { SYNC_CONFIG } from './sync.config';
import { name as appName } from './app.json';

/**
 * Renders either the app that uses Device Sync, or the
 * one only using a local Realm.
 */
export const Root = () => {
    return <App appId={SYNC_CONFIG.appId} />;
}

AppRegistry.registerComponent(appName, () => Root);
