import { Database as DB } from "@/database.types";

declare global {
  interface Database extends DB {}
  type Message = DB["public"]["Tables"]["messages"]["Row"];
  type Participant = Pick<
    DB["public"]["Tables"]["profiles"]["Row"],
    "id" | "first_name" | "last_name" | "role_id" | "email"
  >;
  interface Conversations {
    conversation_id: DB["public"]["Tables"]["conversations"]["Row"]["id"];
    created_at: DB["public"]["Tables"]["conversations"]["Row"]["created_at"];
    deleted_at: DB["public"]["Tables"]["conversations"]["Row"]["deleted_at"];
    updated_at: DB["public"]["Tables"]["conversations"]["Row"]["updated_at"];
    participants: Participant[];
  }

  interface ConvoParticipant {
    conversation_id: string;
    created_at: string | null;
    profile_id: string;
    profiles: {
      first_name: string | null;
      last_name: string | null;
      email: string;
    } | null;
  }
}
