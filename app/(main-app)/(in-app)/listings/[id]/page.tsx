import { getListingByUUID } from "@/app/actions/supabase/listings";
import { getUserPackageRecord } from "@/app/actions/supabase/packages";
import { getUser } from "@/app/actions/supabase/user";
import ListingSinglePageBody from "@/components/app/page-containers/in-app/listing-single-page-body";
import { queryKeys } from "@/lib/config/query-keys.config";
import { hasRole } from "@/lib/utils/app/utils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { id: listingId } = await params;

  const queryClient = new QueryClient();

  const userId = user?.id;
  const userRoleId = user?.user_metadata.role_id;
  const isStudent = hasRole(userRoleId ?? 0, "TENANT");

  if (isStudent) {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.packages(userId),
      queryFn: async () => await getUserPackageRecord(userId),
    });
  }

  await queryClient.prefetchQuery({
    queryKey: queryKeys.listings.byId(listingId),
    queryFn: async () => await getListingByUUID(listingId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingSinglePageBody listingUUID={listingId} />
    </HydrationBoundary>
  );
}
