// UTILITIES
import { getUserPackageRecord } from "@/app/actions/supabase/packages";
import { getActiveSubscription } from "@/app/actions/supabase/subscriptions";
import { getUser } from "@/app/actions/supabase/user";
import { ProfilePageBody } from "@/components/app/page-containers/in-app/profile-page-body";
import { hasRole } from "@/lib/utils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const queryClient = new QueryClient();

  const userId = user?.id;
  const userRoleId = user?.user_metadata.role_id;
  const isLandlord = hasRole(userRoleId ?? 0, "LANDLORD");
  const isStudent = hasRole(userRoleId ?? 0, "TENANT");

  if (isLandlord) {
    await queryClient.prefetchQuery({
      queryKey: ["activeSubscription", userId],
      queryFn: async () => await getActiveSubscription(userId),
    });
  }

  if (isStudent) {
    await queryClient.prefetchQuery({
      queryKey: ["currentPackage", userId],
      queryFn: async () => await getUserPackageRecord(userId),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePageBody />
    </HydrationBoundary>
  );
}
