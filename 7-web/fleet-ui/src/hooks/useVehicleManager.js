import { useQuery } from '@realm/react';
import { useEffect, useState } from 'react';

import { Vehicle } from '../models/Vehicle';

export function useVehicleManager() {
  const [requeryFlag, setRequeryFlag] = useState(false);
  const vehicles = useQuery(Vehicle, (collection) => collection, [requeryFlag]);

  useEffect(() => {
    setRequeryFlag(true);
  }, []);

  return {
    vehicles
  };
}
