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
          deleted_at: string | null
          last_read_at: string | null
          message_cutoff_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          deleted_at?: string | null
          last_read_at?: string | null
          message_cutoff_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          deleted_at?: string | null
          last_read_at?: string | null
          message_cutoff_at?: string | null
          updated_at?: string | null
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
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "user_conversations"
            referencedColumns: ["conversation_id"]
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
          id?: number
          price_paid: number
          stripe_transaction_id: string
          transaction_uuid?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credits_purchased?: number
          id?: number
          price_paid?: number
          stripe_transaction_id?: string
          transaction_uuid?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      credits: {
        Row: {
          created_at: string | null
          remaining_credits: number | null
          total_credits: number
          updated_at: string | null
          used_credits: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          remaining_credits?: number | null
          total_credits?: number
          updated_at?: string | null
          used_credits?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          remaining_credits?: number | null
          total_credits?: number
          updated_at?: string | null
          used_credits?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          id: string
          stripe_customer_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          stripe_customer_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          stripe_customer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_images: {
        Row: {
          created_at: string
          full_path: string
          height: number
          id: number
          listing_uuid: string
          path: string
          url: string
          width: number
        }
        Insert: {
          created_at?: string
          full_path: string
          height: number
          id?: never
          listing_uuid: string
          path: string
          url: string
          width: number
        }
        Update: {
          created_at?: string
          full_path?: string
          height?: number
          id?: never
          listing_uuid?: string
          path?: string
          url?: string
          width?: number
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
          availability_status: Database["public"]["Enums"]["listing_availability_status"]
          created_at: string
          description: string | null
          id: number
          idempotency_key: string | null
          landlord_id: string
          listing_type: Database["public"]["Enums"]["listing_type"]
          listings_search_vector: unknown | null
          location: string
          no_of_bathrooms: number
          no_of_bedrooms: number | null
          payment_frequency: Database["public"]["Enums"]["listing_payment_frequency"]
          price: number
          publication_status: Database["public"]["Enums"]["listing_publication_status"]
          title: string
          updated_at: string | null
          uuid: string
        }
        Insert: {
          availability_status?: Database["public"]["Enums"]["listing_availability_status"]
          created_at?: string
          description?: string | null
          id?: number
          idempotency_key?: string | null
          landlord_id: string
          listing_type: Database["public"]["Enums"]["listing_type"]
          listings_search_vector?: unknown | null
          location: string
          no_of_bathrooms?: number
          no_of_bedrooms?: number | null
          payment_frequency?: Database["public"]["Enums"]["listing_payment_frequency"]
          price: number
          publication_status?: Database["public"]["Enums"]["listing_publication_status"]
          title: string
          updated_at?: string | null
          uuid?: string
        }
        Update: {
          availability_status?: Database["public"]["Enums"]["listing_availability_status"]
          created_at?: string
          description?: string | null
          id?: number
          idempotency_key?: string | null
          landlord_id?: string
          listing_type?: Database["public"]["Enums"]["listing_type"]
          listings_search_vector?: unknown | null
          location?: string
          no_of_bathrooms?: number
          no_of_bedrooms?: number | null
          payment_frequency?: Database["public"]["Enums"]["listing_payment_frequency"]
          price?: number
          publication_status?: Database["public"]["Enums"]["listing_publication_status"]
          title?: string
          updated_at?: string | null
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          id?: number
          message_uuid?: string | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          edited_at?: string | null
          id?: number
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
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "user_conversations"
            referencedColumns: ["conversation_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string | null
          package_name: Database["public"]["Enums"]["package_type"]
          remaining_inquiries: number | null
          total_inquiries: number
          updated_at: string | null
          used_inquiries: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          package_name: Database["public"]["Enums"]["package_type"]
          remaining_inquiries?: number | null
          total_inquiries?: number
          updated_at?: string | null
          used_inquiries?: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          package_name?: Database["public"]["Enums"]["package_type"]
          remaining_inquiries?: number | null
          total_inquiries?: number
          updated_at?: string | null
          used_inquiries?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "packages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
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
          id?: number
          name: string
          price: number
          role_id: number
          stripe_price_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
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
      rate_limits: {
        Row: {
          attempts: number
          created_at: string | null
          endpoint: Database["public"]["Enums"]["rate_limit_endpoint"]
          id: string
          reset_at: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attempts?: number
          created_at?: string | null
          endpoint: Database["public"]["Enums"]["rate_limit_endpoint"]
          id?: string
          reset_at: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attempts?: number
          created_at?: string | null
          endpoint?: Database["public"]["Enums"]["rate_limit_endpoint"]
          id?: string
          reset_at?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      settings: {
        Row: {
          created_at: string
          id: string
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string
          quantity: number | null
          started_at: string
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created?: string
          current_period_end: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id: string
          quantity?: number | null
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string
          quantity?: number | null
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          about: string | null
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role_id: number | null
          updated_at: string | null
        }
        Insert: {
          about?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role_id?: number | null
          updated_at?: string | null
        }
        Update: {
          about?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role_id?: number | null
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
      webhook_events: {
        Row: {
          error: string | null
          event_id: string
          event_type: Database["public"]["Enums"]["webhook_event_type_enum"]
          processed_at: string | null
          request_id: string
          status: Database["public"]["Enums"]["webhook_event_status"]
        }
        Insert: {
          error?: string | null
          event_id: string
          event_type: Database["public"]["Enums"]["webhook_event_type_enum"]
          processed_at?: string | null
          request_id: string
          status?: Database["public"]["Enums"]["webhook_event_status"]
        }
        Update: {
          error?: string | null
          event_id?: string
          event_type?: Database["public"]["Enums"]["webhook_event_type_enum"]
          processed_at?: string | null
          request_id?: string
          status?: Database["public"]["Enums"]["webhook_event_status"]
        }
        Relationships: []
      }
    }
    Views: {
      user_conversations: {
        Row: {
          conversation_id: string | null
          conversations_search_vector: unknown | null
          created_at: string | null
          deleted_at: string | null
          last_message: string | null
          last_message_sender_id: string | null
          last_message_sent_at: string | null
          participant: Json | null
          unread_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      visible_messages_for_user: {
        Row: {
          content: string | null
          conversation_id: string | null
          created_at: string | null
          edited_at: string | null
          id: number | null
          message_uuid: string | null
          read_at: string | null
          sender_id: string | null
          viewer_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_user_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "user_conversations"
            referencedColumns: ["conversation_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      attempt_insert_webhook_event: {
        Args: {
          p_event_id: string
          p_event_type: Database["public"]["Enums"]["webhook_event_type_enum"]
          p_request_id: string
        }
        Returns: {
          inserted: boolean
          status: Database["public"]["Enums"]["webhook_event_status"]
          error: string
        }[]
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
        Args: { initiator_id: string; recipient_id: string }
        Returns: {
          conversation_id: string
          is_new_conversation: boolean
          was_deleted: boolean
        }[]
      }
      evaluate_rate_limit: {
        Args: {
          p_user_id: string
          p_endpoint: Database["public"]["Enums"]["rate_limit_endpoint"]
          p_max_attempts: number
          p_window_hours: number
        }
        Returns: {
          allowed: boolean
          remaining_attempts: number
          reset_at: string
        }[]
      }
      get_conversations_for_user: {
        Args: { pid: string }
        Returns: {
          conversation_id: string
          created_at: string
          deleted_at: string
          updated_at: string
          participants: Json
          last_message: string
          last_message_sent_at: string
          last_message_sender_id: string
          unread_count: number
        }[]
      }
      update_column_value: {
        Args: {
          table_name: string
          table_column: string
          increment: number
          user_id: string
        }
        Returns: undefined
      }
      update_settings: {
        Args: { u_id: string; new_settings: Json }
        Returns: {
          created_at: string
          id: string
          settings: Json | null
          updated_at: string
          user_id: string
        }
      }
      upsert_credits: {
        Args: { p_user_id: string; p_credit_count: number }
        Returns: undefined
      }
      upsert_packages: {
        Args: {
          p_user_id: string
          p_inquiry_count: number
          p_package_name: Database["public"]["Enums"]["package_type"]
        }
        Returns: undefined
      }
    }
    Enums: {
      listing_availability_status: "available" | "taken"
      listing_payment_frequency: "daily" | "weekly" | "monthly" | "yearly"
      listing_publication_status: "published" | "unpublished" | "draft"
      listing_type:
        | "condo"
        | "apartment"
        | "room in family house"
        | "basement unit"
      package_type: "bronze" | "silver" | "gold"
      rate_limit_endpoint:
        | "api/checkout"
        | "api/webhook"
        | "api/verify-session"
        | "api/billing-portal"
      subscription_status:
        | "active"
        | "canceled"
        | "past_due"
        | "trialing"
        | "unpaid"
        | "paused"
        | "incomplete"
        | "incomplete_expired"
      webhook_event_status: "pending" | "completed" | "failed"
      webhook_event_type_enum:
        | "charge.succeeded"
        | "charge.updated"
        | "checkout.session.completed"
        | "customer.created"
        | "customer.updated"
        | "customer.deleted"
        | "customer.subscription.created"
        | "customer.subscription.updated"
        | "customer.subscription.deleted"
        | "invoice.created"
        | "invoice.paid"
        | "invoice.payment_succeeded"
        | "invoice.finalized"
        | "invoice.payment_failed"
        | "payment_intent.created"
        | "payment_intent.succeeded"
        | "payment_intent.payment_failed"
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
      listing_availability_status: ["available", "taken"],
      listing_payment_frequency: ["daily", "weekly", "monthly", "yearly"],
      listing_publication_status: ["published", "unpublished", "draft"],
      listing_type: [
        "condo",
        "apartment",
        "room in family house",
        "basement unit",
      ],
      package_type: ["bronze", "silver", "gold"],
      rate_limit_endpoint: [
        "api/checkout",
        "api/webhook",
        "api/verify-session",
        "api/billing-portal",
      ],
      subscription_status: [
        "active",
        "canceled",
        "past_due",
        "trialing",
        "unpaid",
        "paused",
        "incomplete",
        "incomplete_expired",
      ],
      webhook_event_status: ["pending", "completed", "failed"],
      webhook_event_type_enum: [
        "charge.succeeded",
        "charge.updated",
        "checkout.session.completed",
        "customer.created",
        "customer.updated",
        "customer.deleted",
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
        "invoice.created",
        "invoice.paid",
        "invoice.payment_succeeded",
        "invoice.finalized",
        "invoice.payment_failed",
        "payment_intent.created",
        "payment_intent.succeeded",
        "payment_intent.payment_failed",
      ],
    },
  },
} as const
