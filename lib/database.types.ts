import { Database as DB, Tables } from "@/database.types";

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

  // TODO[REFACTOR]: USE THIS NEW PATTERN BELOW FOR ALL OTHER DATABASE TYPES
  type UserPublic = Tables<"users">;
  type Credits = Tables<"credits">;
  type CreditsTransactions = Tables<"credit_transactions">;
  type Subscriptions = Tables<"subscriptions">;
  type SubscriptionStatus = Tables<"subscriptions">["status"];

  type Listings = Tables<"listings">;
  type ListingsImages = Tables<"listing_images">;
  type ListingType = Listings["listing_type"];
  type ListingPaymentFrequency = Listings["payment_frequency"]
  type ListingPublicationStatus = Listings["publication_status"];
}
