export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          last_message_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_message_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          last_message_id?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          created_at: string | null
          credits_purchased: number
          id: number
          price_paid: number
          stripe_transaction_id: string
          transaction_uuid: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credits_purchased: number
          id?: never
          price_paid: number
          stripe_transaction_id: string
          transaction_uuid?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credits_purchased?: number
          id?: never
          price_paid?: number
          stripe_transaction_id?: string
          transaction_uuid?: string | null
          user_id?: string
        }
        Relationships: []
      }
      credits: {
        Row: {
          remaining_credits: number | null
          total_credits: number | null
          updated_at: string | null
          used_credits: number | null
          user_id: string
        }
        Insert: {
          remaining_credits?: number | null
          total_credits?: number | null
          updated_at?: string | null
          used_credits?: number | null
          user_id: string
        }
        Update: {
          remaining_credits?: number | null
          total_credits?: number | null
          updated_at?: string | null
          used_credits?: number | null
          user_id?: string
        }
        Relationships: []
      }
      listing_images: {
        Row: {
          id: number
          image_url: string
          listing_uuid: string
        }
        Insert: {
          id?: never
          image_url: string
          listing_uuid: string
        }
        Update: {
          id?: never
          image_url?: string
          listing_uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_listing_uuid"
            columns: ["listing_uuid"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["uuid"]
          },
        ]
      }
      listings: {
        Row: {
          created_at: string
          description: string | null
          home_type: Database["public"]["Enums"]["home_type_enum"] | null
          id: number
          landlord_id: string | null
          location: string | null
          no_of_bedrooms: number | null
          payment_frequency:
            | Database["public"]["Enums"]["payment_frequency_enum"]
            | null
          price: number | null
          status: Database["public"]["Enums"]["listing_status_enum"]
          title: string | null
          updated_at: string | null
          uuid: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          home_type?: Database["public"]["Enums"]["home_type_enum"] | null
          id?: never
          landlord_id?: string | null
          location?: string | null
          no_of_bedrooms?: number | null
          payment_frequency?:
            | Database["public"]["Enums"]["payment_frequency_enum"]
            | null
          price?: number | null
          status?: Database["public"]["Enums"]["listing_status_enum"]
          title?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          home_type?: Database["public"]["Enums"]["home_type_enum"] | null
          id?: never
          landlord_id?: string | null
          location?: string | null
          no_of_bedrooms?: number | null
          payment_frequency?:
            | Database["public"]["Enums"]["payment_frequency_enum"]
            | null
          price?: number | null
          status?: Database["public"]["Enums"]["listing_status_enum"]
          title?: string | null
          updated_at?: string | null
          uuid?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          edited_at: string | null
          id: number
          message_uuid: string | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id?: string
          created_at?: string
          edited_at?: string | null
          id?: never
          message_uuid?: string | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          edited_at?: string | null
          id?: never
          message_uuid?: string | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          price: number
          role_id: number
          stripe_price_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: never
          name: string
          price: number
          role_id: number
          stripe_price_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: never
          name?: string
          price?: number
          role_id?: number
          stripe_price_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plans_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: number
          plan_id: number
          start_date: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id: string
          subscription_uuid: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: never
          plan_id: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id: string
          subscription_uuid?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: never
          plan_id?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_subscription_id?: string
          subscription_uuid?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          newsletter: boolean | null
          phone: string | null
          role_id: number
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          newsletter?: boolean | null
          phone?: string | null
          role_id: number
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          newsletter?: boolean | null
          phone?: string | null
          role_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_participant_access: {
        Args: {
          convo_id: string
          pid: string
        }
        Returns: boolean
      }
      check_password_match: {
        Args: {
          user_id: string
          new_password: string
        }
        Returns: boolean
      }
      check_user_existence: {
        Args: {
          user_email_address: string
        }
        Returns: {
          user_id: string
          user_email: string
        }[]
      }
      create_conversation: {
        Args: {
          user1_id: string
          user2_id: string
        }
        Returns: string
      }
      get_conversations_for_user: {
        Args: {
          pid: string
        }
        Returns: {
          conversation_id: string
          created_at: string
          deleted_at: string
          updated_at: string
          participants: Json
        }[]
      }
      soft_delete_conversation: {
        Args: {
          conversation_id_param: string
          user_id_param: string
        }
        Returns: boolean
      }
    }
    Enums: {
      home_type_enum: "Condo" | "Apartment"
      listing_status_enum: "Available" | "Taken"
      payment_frequency_enum: "daily" | "weekly" | "monthly" | "yearly"
      subscription_status: "active" | "canceled" | "past_due"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
