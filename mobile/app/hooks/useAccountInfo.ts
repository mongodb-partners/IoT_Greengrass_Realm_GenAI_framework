import { useMemo } from 'react';
import { useUser } from '@realm/react';

export function useAccountInfo() {
  const user = useUser();
  const accountInfo = useMemo(
    () => ({
      userId: user.id,
      email: user.profile.email
    }),
    [user],
  );

  return accountInfo;
}
