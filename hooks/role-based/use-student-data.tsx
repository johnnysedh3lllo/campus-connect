import { hasRole } from "@/lib/utils";

export function useStudentData(
  userId: string | undefined,
  userRoleId: number | null,
) {
  const isStudent = hasRole(userRoleId, "TENANT");

  //   const {
  //     data: activeSubscription,
  //     isLoading,
  //     error,
  //   } = useGetPackage(userId, userRoleId);

  const packageDetails = false;

  return {
    isStudent,
    packageDetails,
  };
}
