import { useQuery } from '@realm/react';
import { useEffect, useState } from 'react';

import { Job } from '../models/Job';

export function useJobManager() {
  const [requeryFlag, setRequeryFlag] = useState(false);
  const jobs = useQuery(Job, (collection) => collection, [requeryFlag]);

  useEffect(() => {
    setRequeryFlag(true);
  }, []);

  return {
    jobs
  };
}
