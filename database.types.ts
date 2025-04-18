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
          total_credits: number
          updated_at: string | null
          used_credits: number | null
          user_id: string
        }
        Insert: {
          remaining_credits?: number | null
          total_credits?: number
          updated_at?: string | null
          used_credits?: number | null
          user_id: string
        }
        Update: {
          remaining_credits?: number | null
          total_credits?: number
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
      check_landlord_premium_status: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      check_participant_access: {
        Args: { convo_id: string; pid: string }
        Returns: boolean
      }
      check_password_match: {
        Args: { user_id: string; new_password: string }
        Returns: boolean
      }
      check_user_existence: {
        Args: { user_email_address: string }
        Returns: {
          user_id: string
          user_email: string
        }[]
      }
      create_conversation: {
        Args: { user1_id: string; user2_id: string }
        Returns: string
      }
      get_conversations_for_user: {
        Args: { pid: string }
        Returns: {
          conversation_id: string
          created_at: string
          deleted_at: string
          updated_at: string
          participants: Json
        }[]
      }
      increment_column_value: {
        Args: {
          table_name: string
          table_column: string
          increment: number
          user_id: string
        }
        Returns: undefined
      }
      soft_delete_conversation: {
        Args: { conversation_id_param: string; user_id_param: string }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      home_type_enum: ["Condo", "Apartment"],
      listing_status_enum: ["Available", "Taken"],
      payment_frequency_enum: ["daily", "weekly", "monthly", "yearly"],
      subscription_status: ["active", "canceled", "past_due"],
    },
  },
} as const
