import { useQuery, useRealm } from '@realm/react';
import { useState, useCallback } from 'react';

import { Job } from '../models/schema';

export function useJobManager() {
  const realm = useRealm();
  const [filter, setStatus] = useState('TODO');
  const jobs = useQuery(Job, (collection) => collection.filtered('status == $0', filter), [filter]);

  const updateJob = useCallback(
    (value: string, notes: string, job: Job) => {
      realm.write(() => {
        job.status = value;
        job.notes = notes;
      });
    },
    [realm],
  );

  const setSelectedStatus = useCallback((status: string) => {
    //console.log(">>>>>>>>>>>>", status);
    setStatus(status)
  }, [filter]);

  return {
    jobs,
    setSelectedStatus,
    updateJob
  };
}

