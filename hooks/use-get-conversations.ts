"use client";

import { useState, useEffect } from "react";
import { getUserConversationsWithParticipants } from "@/app/actions";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUserConversationsWithParticipants();
      setConversations(result || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversations",
      );
      console.error("Error loading conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
  };
};
