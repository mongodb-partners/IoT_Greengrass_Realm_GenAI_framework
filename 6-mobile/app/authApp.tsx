import React from 'react';
import Realm, { BSON } from 'realm';
import { OpenRealmBehaviorType } from 'realm';
import { RealmProvider } from '@realm/react';
import { Loading } from './components/Loading';
import { schemas } from './models';
import { HomeScreen } from './screens/HomeScreen';
import { Job, Vehicle, User } from './models/schema';
import { useAccountInfo } from './hooks/useAccountInfo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HelpScreen } from './screens/HelpScreen';

const Stack = createStackNavigator();

export function AuthApp() {
  const { userId } = useAccountInfo();
  const objUserId = new BSON.ObjectId(userId);
  console.log(objUserId);

  return (
    <RealmProvider
      fallback={Loading}
      schema={schemas}
      sync={{
        flexible: true,
        initialSubscriptions: {
          update: (mutableSubs, realm) => {
            mutableSubs.add(realm.objects(Vehicle), { name: 'allVehicles' });
            mutableSubs.add(realm.objects(Job).filtered('assignedTo == $0', objUserId), { name: 'allJobs' });
            mutableSubs.add(realm.objects(User).filtered('userId == $0', objUserId), { name: 'allUsers' });
          }
        },
        newRealmFileBehavior: {
          type: OpenRealmBehaviorType.DownloadBeforeOpen,
        },
        existingRealmFileBehavior: {
          type: OpenRealmBehaviorType.OpenImmediately,
        },
      }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RealmProvider>
  );
}
