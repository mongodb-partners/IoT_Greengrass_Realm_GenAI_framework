import React from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { Job } from '../models/schema';
import JobList from '../components/JobList';

type JobProps = {
  jobs: Job[];
  onTabChange: (status: string) => void;
  updateJob: (value: string, notes: string, job: Job) => void;
};

export const JobScreen = ({ jobs, onTabChange, updateJob }: JobProps) => {

  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'TODO', title: 'TODO' },
    { key: 'INPROGRESS', title: 'INPROGRESS' },
    { key: 'CANCELLED', title: 'CANCELLED' },
    { key: 'COMPLETED', title: 'COMPLETED' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'TODO': return <JobList jobs={jobs} onItemUpdate={updateJob}></JobList>
      case 'INPROGRESS': return <JobList jobs={jobs} onItemUpdate={updateJob}></JobList>
      case 'CANCELLED': return <JobList jobs={jobs} onItemUpdate={updateJob}></JobList>
      case 'COMPLETED': return <JobList jobs={jobs} onItemUpdate={updateJob}></JobList>
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={props => (
        <TabBar
          {...props}
          renderLabel={({ route, color }) => (
            <Text numberOfLines={1} style={{ color: 'black', fontSize: 10, margin: 8}}>
              {route.title}
            </Text>
          )}
          style={{ backgroundColor: 'white' }}
          onTabPress={({ route }) => {
            onTabChange(route.key);
          }}
        />
      )}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};