import { getUserSettings } from "@/app/actions/supabase/settings";
import { getUser } from "@/app/actions/supabase/user";
import SettingsPageBody from "@/components/app/page-containers/in-app/settings-page-body";
import { queryKeys } from "@/lib/query-keys.config";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const queryClient = new QueryClient();

  const userId = user?.id;

  await queryClient.prefetchQuery({
    queryKey: queryKeys.user.settings,
    queryFn: async () => await getUserSettings(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsPageBody />;
    </HydrationBoundary>
  );
}
