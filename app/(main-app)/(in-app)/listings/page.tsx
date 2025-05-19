import { Metadata } from "next";
import { getListings } from "@/app/actions/supabase/listings";
import { QueryClient } from "@tanstack/react-query";
import { getUser } from "@/app/actions/supabase/user";
import { ListingsPageLandlord } from "@/components/app/page-containers/in-app/listings-page-landlord";
import { ListingsPageTenant } from "@/components/app/page-containers/in-app/listings-page-tenant";
import { hasRole } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Listings",
};

export default async function Page() {
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
      queryKey: ["listings", userId, "published"],
      queryFn: async () => await getListings(userId, "published"),
    });
  }

  if (isStudent) {
    await queryClient.prefetchQuery({
      queryKey: ["listings", "public", "published"],
      queryFn: async () => await getListings(undefined, "published"),
    });
  }

  return (
    <>
      <ListingsPageLandlord />

      <ListingsPageTenant />
    </>
  );
}
