import { getActiveSubscription } from "@/app/actions/supabase/subscriptions";
import { getUser } from "@/app/actions/supabase/user";
import PlansPageBody from "@/components/app/page-containers/in-app/plans-page-body";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plans",
};

export default async function PlansPage() {
  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const queryClient = new QueryClient();

  const userId = user?.id;

  await queryClient.prefetchQuery({
    queryKey: ["activeSubscription", userId],
    queryFn: async () => await getActiveSubscription(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlansPageBody />
    </HydrationBoundary>
  );
}
