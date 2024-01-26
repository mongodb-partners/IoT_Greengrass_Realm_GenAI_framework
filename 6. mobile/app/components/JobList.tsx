// CommonTabScreen.tsx
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Job } from '../models/schema';
import { JobItem } from './JobItem';

interface JobsListProps {
  jobs: Job[];
  onItemUpdate: (value: string, notes: string, job: Job) => void;
}
export const JobList = ({ jobs, onItemUpdate }: JobsListProps) => {
  return (
    <View>
      <FlatList
        data={jobs}
        renderItem={({ item: job }) => (
          <JobItem
            job={job}
            onUpdate={onItemUpdate}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default JobList;