import { getListings } from "@/app/actions/supabase/listings";
import { getUserPublic } from "@/app/actions/supabase/user";
import { ListingLandlordIdPageBody } from "@/components/app/page-containers/in-app/listing-landlord-id-page-body";
import { QueryClient } from "@tanstack/react-query";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["userPublic"],
    queryFn: async () => await getUserPublic(id),
  });

  await queryClient.prefetchQuery({
    queryKey: ["listings", id ?? "public", "published"],
    queryFn: async () => await getListings(id, "published"),
  });

  return <ListingLandlordIdPageBody landlordId={id} />;
}
