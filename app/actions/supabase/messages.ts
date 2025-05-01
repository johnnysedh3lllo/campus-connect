"use server";
import { ConversationFormType } from "@/lib/form.types";
import { createClient } from "@/utils/supabase/server";

export async function getMessages(conversationId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (error) {
      console.log("Error during fetching", error);
      throw error;
    }

    return data as Message[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch conversation: ${error.message}`);
    }
    throw new Error("Could not get messages");
  }
}

export async function getUserConversationsWithParticipants() {
  const supabase = await createClient();

  try {
    // Get the current authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { data: conversations, error } = await supabase.rpc(
      "get_conversations_for_user",
      { pid: user.id },
    );

    if (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }

    return conversations as Conversations[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get conversations ${error.message}`);
    }
  }
}

export async function getParticipants(conversationId: string, userId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("conversation_participants")
      .select("*, users(first_name, last_name, email)")
      .eq("conversation_id", conversationId)
      .neq("user_id", userId);

    if (error) {
      console.error("Error fetching participants:", error);
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get participants ${error.message}`);
    }
  }
}

export async function updateConversationParticipants(
  conversationData: ConversationFormType,
  conversationParticipantsDetails: ConversationParticipantsUpdate,
) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("conversation_participants")
      .update(conversationParticipantsDetails)
      .eq("user_id", conversationData.userId)
      .eq("conversation_id", conversationData.conversationId);

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      error: {
        message:
          "Something went wrong while deleting this chat, please try again.",
      },
    };
  }
}
