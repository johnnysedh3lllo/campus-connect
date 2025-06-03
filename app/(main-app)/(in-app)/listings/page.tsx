import { Metadata } from "next";
import { getListings } from "@/app/actions/supabase/listings";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getUser } from "@/app/actions/supabase/user";
import { ListingsPageLandlord } from "@/components/app/page-containers/in-app/listings-page-landlord";
import { ListingsPageTenant } from "@/components/app/page-containers/in-app/listings-page-tenant";
import { hasRole } from "@/lib/utils";
import { upsertUserSettings } from "@/app/actions/supabase/settings";
import { createClient } from "@/utils/supabase/server";
import { queryKeys } from "@/lib/config/query-keys.config";
import { LISTING_PAGE_SIZE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Listings",
};

type WelcomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: WelcomeProps) {
  const supabase = await createClient();

  const user = await getUser();
  const params = await searchParams;

  if (!user) {
    throw new Error("User not found");
  }

  const queryClient = new QueryClient();

  const userId = user?.id;
  const userMetadata = user?.user_metadata;
  const userRoleId = userMetadata.role_id;

  if (params.status && params.status === "onboarding_success") {
    const userSettings = userMetadata.settings;

    const result = await upsertUserSettings(userId, userSettings);

    if (!result?.success) {
      console.error(result?.error);
    } else {
      // TODO: CONSIDER REMOVING THE SETTINGS PROPERTY FROM THE METADATA OBJECT
      // const metadata = userMetadata ?? {};
      // delete metadata.settings;
      // const { data, error } = await supabase.auth.updateUser({
      //   data: metadata,
      // });
    }
  }

  const isLandlord = hasRole(userRoleId ?? 0, "LANDLORD");
  const isStudent = hasRole(userRoleId ?? 0, "TENANT");

  if (isLandlord) {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.listings.published(userId, undefined),
      queryFn: async () =>
        await getListings({
          pubStatus: "published",
          from: 0,
          to: LISTING_PAGE_SIZE,
          userId: userId,
        }),
    });
  }

  if (isStudent) {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.listings.published(userId, undefined),
      queryFn: async () =>
        await getListings({
          pubStatus: "published",
          from: 0,
          to: LISTING_PAGE_SIZE,
        }),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListingsPageLandlord />
      <ListingsPageTenant />
    </HydrationBoundary>
  );
}
