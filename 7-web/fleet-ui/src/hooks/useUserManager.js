import { useQuery } from '@realm/react';
import { useEffect, useState } from 'react';

import { User } from '../models/User';

export function useUserManager() {
  const [requeryFlag, setRequeryFlag] = useState(false);
  const users = useQuery(User, (collection) => collection, [requeryFlag]);

  useEffect(() => {
    setRequeryFlag(true);
  }, []);

  return {
    users
  };
}
