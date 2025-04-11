import { Database as DB } from "@/database.types";

declare global {
  interface Database extends DB {}

  type Message = DB["public"]["Tables"]["messages"]["Row"] & {
    // Add this to track optimistic updates
    optimisticId?: string; // Temporary client-side ID for tracking
    status?: "optimistic" | "confirmed" | "failed";
  };

  type Participant = Pick<
    DB["public"]["Tables"]["users"]["Row"],
    "id" | "first_name" | "last_name" | "role_id" | "email"
  >;

  type Conversations = {
    conversation_id: DB["public"]["Tables"]["conversations"]["Row"]["id"];
    created_at: DB["public"]["Tables"]["conversations"]["Row"]["created_at"];
    deleted_at: DB["public"]["Tables"]["conversations"]["Row"]["deleted_at"];
    updated_at: DB["public"]["Tables"]["conversations"]["Row"]["updated_at"];
    participants: Participant[];
  };

  type ConvoParticipant = {
    conversation_id: string;
    created_at: string | null;
    user_id: string;
    users: {
      first_name: string | null;
      last_name: string | null;
      email: string;
    } | null;
  };

  type UserProfile = DB["public"]["Tables"]["users"]["Row"];
  type Listing = DB["public"]["Tables"]["listings"];
  type ListingImage = DB["public"]["Tables"]["listing_images"];
  type PaymentFrequency = DB["public"]["Enums"]["payment_frequency_enum"];
  type HomeType = DB["public"]["Enums"]["home_type_enum"];
  type ListingStatus = DB["public"]["Enums"]["listing_status_enum"];
}
