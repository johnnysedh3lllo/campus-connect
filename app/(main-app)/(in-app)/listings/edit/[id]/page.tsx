import { QueryClient } from "@tanstack/react-query";
import { getListingByUUID } from "@/app/actions/supabase/listings";
import ListingEditPageBody from "@/components/app/page-containers/in-app/listing-edit-page-body";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["listings", id],
    queryFn: async () => await getListingByUUID(id),
  });

  return <ListingEditPageBody listingUUID={id} />;
}
