import { useQuery } from '@realm/react';
import { useEffect, useState } from 'react';

import { Part } from '../models/Part';

export function usePartManager() {
  const [requeryFlag, setRequeryFlag] = useState(false);
  const parts = useQuery(Part, (collection) => collection, [requeryFlag]);

  useEffect(() => {
    setRequeryFlag(true);
  }, []);

  return {
    parts
  };
}
