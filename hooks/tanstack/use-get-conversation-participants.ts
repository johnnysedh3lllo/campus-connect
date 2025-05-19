import { getConversationParticipants } from "@/app/actions/supabase/messages";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { queryKeys } from "@/lib/query-keys.config";

export function useGetConversationParticipants(
  userId: string,
  conversationId: string,
) {
  const conversationParticipantsQueryKey = queryKeys.conversations.participants(
    userId,
    conversationId,
  );

  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: conversationParticipantsQueryKey,
    queryFn: async () =>
      await getConversationParticipants(userId, conversationId),
    enabled: !!userId && !!conversationId,
    // staleTime: DEFAULT_STALE_TIME,
    staleTime: Infinity,
  });

  // useEffect(() => {
  //   // Create a channel to listen for changes
  //   // Listen for conversation participant updates (e.g., read status)
  //   const channel = supabase
  //     .channel("conversations-changes")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "conversation_participants",
  //       },
  //       (payload) => {
  //         const eventType = payload.eventType;
  //         switch (eventType) {
  //           case "UPDATE":
  //           case "INSERT":
  //           case "DELETE":
  //             console.log("conversation participants", payload);

  //             queryClient.invalidateQueries({
  //               queryKey: conversationParticipantsQueryKey,
  //             });
  //             break;
  //           default:
  //             console.log("unhandled payload event");
  //             break;
  //         }
  //       },
  //     )
  //     .subscribe();

  //   // Clean up the subscription when the component unmounts
  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [queryClient, supabase]);

  return query;
}
