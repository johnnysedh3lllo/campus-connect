import ListingIdPageBody from "@/components/app/page-containers/in-app/listing-id-page-body";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ListingIdPageBody listingUUID={id} />;
}
