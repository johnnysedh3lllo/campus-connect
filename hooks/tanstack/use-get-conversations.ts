// hooks/use-conversations.ts
"use client";

import { getConversations } from "@/app/actions/supabase/messages";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

export function useGetConversations(userId: string | undefined) {
  const queryClient = useQueryClient();
  const conversationQueryKey = ["conversations", userId];

  const query = useQuery({
    queryKey: conversationQueryKey,
    queryFn: async () => await getConversations(userId),
    enabled: !!userId,
    // staleTime: DEFAULT_STALE_TIME,
    staleTime: Infinity,
  });

  const refetch = query.refetch;

  // TODO: REFACTOR TO USE BROADCAST INSTEAD
  useEffect(() => {
    // Create a channel to listen for changes
    const channel = supabase
      .channel("conversations-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        (payload) => {
          const eventType = payload.eventType;
          switch (eventType) {
            case "UPDATE":
            case "INSERT":
            case "DELETE":
              queryClient.invalidateQueries({ queryKey: conversationQueryKey });
              break;
            default:
              console.log("unhandled payload event");
              break;
          }
        },
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient, supabase]);

  return query;
}
