"use client";

import { ConversationLIstInfiniteQueryKeys } from "@/lib/config/query-keys.config";
import { supabase } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useConversationsRealtime({
  userId,
  queryKey,
}: {
  userId: string | undefined;
  queryKey: ConversationLIstInfiniteQueryKeys;
}) {
  const queryClient = useQueryClient();

  // TODO: REFACTOR TO USE BROADCAST INSTEAD
  useEffect(() => {
    if (!userId) return;

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
          const { eventType } = payload;
          if (["INSERT", "UPDATE", "DELETE"].includes(eventType)) {
            queryClient.refetchQueries({ queryKey });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}
