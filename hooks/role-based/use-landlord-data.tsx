import { hasRole } from "@/lib/utils";
import { useGetActiveSubscription } from "../tanstack/use-get-active-subscription";

export function useLandlordData(
  userId: string | undefined,
  userRoleId: number | null,
) {
  const isLandlord = hasRole(userRoleId, "LANDLORD");

  const {
    data: activeSubscription,
    isLoading,
    error,
  } = useGetActiveSubscription(userId, userRoleId);

  return {
    isLandlord,
    activeSubscription,
    isLoading,
    error,
  };
}
