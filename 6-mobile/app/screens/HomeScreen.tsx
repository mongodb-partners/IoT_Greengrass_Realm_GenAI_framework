import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@realm/react';
import { colors } from '../styles/colors';
import { JobScreen } from './JobScreen';
import { useJobManager } from '../hooks/useJobManager';

export function HomeScreen() {

  const { logOut } = useAuth();
  const { jobs, setSelectedStatus, updateJob } = useJobManager();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Job List</Text>
        </View>
        <Pressable style={styles.authButton} onPress={logOut}>
          <Text style={styles.authButtonText}>Log Out</Text>
        </Pressable>
      </View>

      <JobScreen
        jobs={jobs}
        updateJob={updateJob}
        onTabChange={setSelectedStatus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: 10,
    borderColor: colors.grayMedium,
    backgroundColor: colors.grayLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: colors.grayMedium,
    backgroundColor: colors.white,
  },
  titleContainer: {
    paddingLeft: 10,
  },
  title: {
    marginBottom: 10,
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: colors.black,
  },
  info: {
    fontSize: 13,
    color: colors.black,
  },
  authButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: colors.grayMedium,
  },
  authButtonText: {
    fontWeight: 'bold',
    color: colors.black,
  },
});
