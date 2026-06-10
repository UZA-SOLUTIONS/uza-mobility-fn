import type { QueryClient } from '@tanstack/react-query';
import { authKeys } from '@/queries/auth';
import { bookingKeys } from '@/queries/bookings';
import { buyerKeys } from '@/queries/buyer';
import { notificationKeys } from '@/queries/notifications';
import { operatorKeys } from '@/queries/operator';
import { sellerKeys } from '@/queries/seller';

/** Remove cached data tied to the previous signed-in user. */
export function clearUserSessionQueries(queryClient: QueryClient) {
  const scopes = [
    authKeys.all,
    notificationKeys.all,
    buyerKeys.all,
    bookingKeys.all,
    sellerKeys.all,
    operatorKeys.all,
  ];

  for (const queryKey of scopes) {
    queryClient.removeQueries({ queryKey });
  }
}
