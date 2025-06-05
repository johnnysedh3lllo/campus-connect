"use server";
import { ConversationFormType } from "@/types/form.types";
import { createClient } from "@/utils/supabase/server";
import { updateUserPackageInquiries } from "./packages";
import { MIN_INQUIRIES } from "@/lib/constants";

// TODO: SETUP A GUARD CLAUSE FOR BOTH FUNCTION PARAMETERS
export async function getConversationMessages(
  conversationId: string,
  userId: string,
) {
  const supabase = await createClient();

  try {
    if (!userId) {
      throw new Error("User Id is required to get messages");
    }

    const { data, error } = await supabase
      .from("visible_messages_for_user")
      .select("*")
      .eq("conversation_id", conversationId)
      .eq("viewer_id", userId) // this filters to *your* visible messages
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return data as Messages[];
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      throw new Error(`Failed to fetch conversation: ${error.message}`);
    }
    throw new Error("Could not get messages");
  }
}
export async function insertMessages(messageDetails: MessagesInsert) {
  const supabase = await createClient();

  const conversationId = messageDetails.conversation_id;
  try {
    if (!conversationId) {
      throw new Error("Conversation ID is required");
    }

    const { data, error } = await supabase
      .from("messages")
      .insert(messageDetails)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(`Failed to add a new message ${error.message}`);
    }
  }
}
export async function getConversationParticipants(
  userId: string,
  conversationId: string,
) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("conversation_participants")
      .select(
        "*, users(first_name, last_name, full_name, email, role_id, about, avatar_url)",
      )
      .eq("conversation_id", conversationId)
      .neq("user_id", userId);

    if (error) {
      console.error("Error fetching participants:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(`Failed to get participants ${error.message}`);
    }
  }
}

export async function getConversations({
  userId,
  from,
  to,
  searchTerm,
}: {
  userId: string | undefined;
  from: number;
  to: number;
  searchTerm?: string;
}): Promise<Conversations[] | undefined> {
  const supabase = await createClient();

  if (!userId) {
    throw new Error("User ID is required to get conversations");
  }

  try {
    let query = supabase
      .from("user_conversations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (searchTerm) {
      query = query.textSearch("conversations_search_vector", searchTerm, {
        type: "websearch",
        config: "english",
      });
    }

    const { data, error } = await query.range(from, to);

    if (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }

    return data as Conversations[];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get conversations ${error.message}`);
    }
  }
}

export async function createConversation(
  tenantId: string | undefined,
  landlordId: string | undefined,
) {
  const supabase = await createClient();

  if (!tenantId || !landlordId) {
    throw new Error(
      "TenantID and Landlord ID is required to create a conversation",
    );
  }

  // TODO: in the future, the check if a student has a package and has package inquires should be handled here on the server
  try {
    let { data, error } = await supabase
      .rpc("create_conversation", {
        initiator_id: tenantId,
        recipient_id: landlordId,
      })
      .maybeSingle();

    if (error) {
      throw error;
    }

    // if there is no error and a conversation was found, then handled package deduction
    if (data?.is_new_conversation) {
      // deduct package inquire from student
      await updateUserPackageInquiries(
        tenantId,
        MIN_INQUIRIES,
        "used_inquiries",
      );
    } else {
      if (data?.was_deleted) {
        // restore deleted conversation
        await updateConversationParticipants(
          { userId: tenantId, conversationId: data?.conversation_id! },
          {
            deleted_at: null,
          },
        );
      }
    }

    return { success: true, data };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      error,
    };
  }
}

export async function updateConversations(
  conversationId: string,
  conversationDetails: ConversationsInsert,
) {
  const supabase = await createClient();

  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  try {
    const { error } = await supabase
      .from("conversations")
      .update(conversationDetails)
      .eq("id", conversationId);
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating conversations:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to update conversations ${error.message}`);
    }
  }
}
export async function updateConversationParticipants(
  conversationData: ConversationFormType,
  conversationParticipantsDetails: ConversationParticipantsUpdate,
): Promise<{ success: boolean; data?: any; error?: { message: string } }> {
  // TODO: TYPE THIS ABOVE
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("conversation_participants")
      .update({
        ...conversationParticipantsDetails,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", conversationData.userId)
      .eq("conversation_id", conversationData.conversationId);

    if (error) {
      throw new Error("Couldn't update conversations participants");
    }

    await updateConversations(conversationData.conversationId, {
      updated_at: new Date().toISOString(),
    });

    return { success: true, data };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      error: { message: error.message },
    };
  }
}
