import { getUserConversationsWithParticipants } from "@/app/actions/supabase/messages";
import { DEFAULT_STALE_TIME } from "@/lib/app.config";
import { useQuery } from "@tanstack/react-query";

export function useUserConversations() {
  return useQuery({
    queryKey: ["userConversations"],
    queryFn: getUserConversationsWithParticipants,
    staleTime: DEFAULT_STALE_TIME, // cache data for 5 minutes
  });
}
