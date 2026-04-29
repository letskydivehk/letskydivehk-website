export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_name: string | null
          category: string
          content: string
          content_zh_cn: string | null
          content_zh_tw: string | null
          cover_image: string | null
          created_at: string
          display_order: number
          excerpt: string | null
          excerpt_zh_cn: string | null
          excerpt_zh_tw: string | null
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          title_zh_cn: string | null
          title_zh_tw: string | null
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          category?: string
          content?: string
          content_zh_cn?: string | null
          content_zh_tw?: string | null
          cover_image?: string | null
          created_at?: string
          display_order?: number
          excerpt?: string | null
          excerpt_zh_cn?: string | null
          excerpt_zh_tw?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          title_zh_cn?: string | null
          title_zh_tw?: string | null
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          category?: string
          content?: string
          content_zh_cn?: string | null
          content_zh_tw?: string | null
          cover_image?: string | null
          created_at?: string
          display_order?: number
          excerpt?: string | null
          excerpt_zh_cn?: string | null
          excerpt_zh_tw?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          title_zh_cn?: string | null
          title_zh_tw?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          access_token: string | null
          created_at: string
          deposit_amount: number | null
          email: string
          first_name: string
          id: string
          last_name: string
          location_id: string
          participants: number
          payment_intent_id: string | null
          payment_status: string | null
          phone: string
          preferred_date: string
          referral_code: string | null
          selected_promos: string[] | null
          service_id: string
          special_requests: string | null
          status: string
          token_expires_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          deposit_amount?: number | null
          email: string
          first_name: string
          id?: string
          last_name: string
          location_id: string
          participants?: number
          payment_intent_id?: string | null
          payment_status?: string | null
          phone: string
          preferred_date: string
          referral_code?: string | null
          selected_promos?: string[] | null
          service_id: string
          special_requests?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string
          deposit_amount?: number | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          location_id?: string
          participants?: number
          payment_intent_id?: string | null
          payment_status?: string | null
          phone?: string
          preferred_date?: string
          referral_code?: string | null
          selected_promos?: string[] | null
          service_id?: string
          special_requests?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "location_services"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          description: string | null
          email: string | null
          full_name: string | null
          id: string
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number
          file_path: string
          file_url: string
          id: string
          is_featured: boolean
          media_type: string
          thumbnail_url: string | null
          title: string | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          file_path: string
          file_url: string
          id?: string
          is_featured?: boolean
          media_type: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          file_path?: string
          file_url?: string
          id?: string
          is_featured?: boolean
          media_type?: string
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      location_accommodations: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          distance: string | null
          id: string
          image_url: string | null
          location_id: string
          name: string
          price_tier: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          distance?: string | null
          id?: string
          image_url?: string | null
          location_id: string
          name: string
          price_tier?: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          distance?: string | null
          id?: string
          image_url?: string | null
          location_id?: string
          name?: string
          price_tier?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      location_attractions: {
        Row: {
          category: string
          created_at: string
          description: string | null
          display_order: number
          distance: string | null
          id: string
          image_url: string | null
          location_id: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          distance?: string | null
          id?: string
          image_url?: string | null
          location_id: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          distance?: string | null
          id?: string
          image_url?: string | null
          location_id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      location_food: {
        Row: {
          created_at: string
          description: string | null
          dish_name: string
          display_order: number
          id: string
          image_url: string | null
          location_id: string
          updated_at: string
          where_to_try: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          dish_name: string
          display_order?: number
          id?: string
          image_url?: string | null
          location_id: string
          updated_at?: string
          where_to_try?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          dish_name?: string
          display_order?: number
          id?: string
          image_url?: string | null
          location_id?: string
          updated_at?: string
          where_to_try?: string | null
        }
        Relationships: []
      }
      location_photos: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number
          file_path: string
          file_url: string
          id: string
          location_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number
          file_path: string
          file_url: string
          id?: string
          location_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number
          file_path?: string
          file_url?: string
          id?: string
          location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_photos_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      location_services: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          includes: string[] | null
          is_popular: boolean
          location_id: string
          price_display: string
          service_name: string
          service_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          includes?: string[] | null
          is_popular?: boolean
          location_id: string
          price_display: string
          service_name: string
          service_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          includes?: string[] | null
          is_popular?: boolean
          location_id?: string
          price_display?: string
          service_name?: string
          service_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_services_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          airport_distance: string | null
          best_months: number[] | null
          City: string | null
          city_distance: string | null
          climate_summary: string | null
          coming_soon: boolean
          country: string
          created_at: string
          description: string | null
          display_order: number
          getting_there_from_hk: string | null
          google_maps_embed_url: string | null
          has_aff: boolean
          has_group_events: boolean
          highlights: string[] | null
          id: string
          image_url: string | null
          is_active: boolean
          Name: string
          slug: string
          transportation: string | null
          travel_tips: Json | null
          updated_at: string
          weather_lat: number | null
          weather_lon: number | null
        }
        Insert: {
          airport_distance?: string | null
          best_months?: number[] | null
          City?: string | null
          city_distance?: string | null
          climate_summary?: string | null
          coming_soon?: boolean
          country: string
          created_at?: string
          description?: string | null
          display_order?: number
          getting_there_from_hk?: string | null
          google_maps_embed_url?: string | null
          has_aff?: boolean
          has_group_events?: boolean
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          Name: string
          slug: string
          transportation?: string | null
          travel_tips?: Json | null
          updated_at?: string
          weather_lat?: number | null
          weather_lon?: number | null
        }
        Update: {
          airport_distance?: string | null
          best_months?: number[] | null
          City?: string | null
          city_distance?: string | null
          climate_summary?: string | null
          coming_soon?: boolean
          country?: string
          created_at?: string
          description?: string | null
          display_order?: number
          getting_there_from_hk?: string | null
          google_maps_embed_url?: string | null
          has_aff?: boolean
          has_group_events?: boolean
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          Name?: string
          slug?: string
          transportation?: string | null
          travel_tips?: Json | null
          updated_at?: string
          weather_lat?: number | null
          weather_lon?: number | null
        }
        Relationships: []
      }
      membership_tiers: {
        Row: {
          color: string | null
          created_at: string
          credit_multiplier: number
          display_order: number
          icon: string | null
          id: string
          min_jumps: number
          name: string
          name_zh_cn: string | null
          name_zh_tw: string | null
          perks: string[] | null
          perks_zh_cn: string[] | null
          perks_zh_tw: string[] | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          credit_multiplier?: number
          display_order?: number
          icon?: string | null
          id?: string
          min_jumps?: number
          name: string
          name_zh_cn?: string | null
          name_zh_tw?: string | null
          perks?: string[] | null
          perks_zh_cn?: string[] | null
          perks_zh_tw?: string[] | null
        }
        Update: {
          color?: string | null
          created_at?: string
          credit_multiplier?: number
          display_order?: number
          icon?: string | null
          id?: string
          min_jumps?: number
          name?: string
          name_zh_cn?: string | null
          name_zh_tw?: string | null
          perks?: string[] | null
          perks_zh_cn?: string[] | null
          perks_zh_tw?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          full_name: string | null
          id: string
          phone: string | null
          referral_code: string | null
          tier_id: string | null
          total_jumps: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          referral_code?: string | null
          tier_id?: string | null
          total_jumps?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          referral_code?: string | null
          tier_id?: string | null
          total_jumps?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "membership_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          available_everywhere: boolean
          booking_type: string
          created_at: string
          description: string | null
          display_order: number
          duration: string | null
          icon_name: string
          id: string
          includes: string[] | null
          is_popular: boolean
          price_display: string
          price_note: string | null
          slug: string
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          available_everywhere?: boolean
          booking_type?: string
          created_at?: string
          description?: string | null
          display_order?: number
          duration?: string | null
          icon_name?: string
          id?: string
          includes?: string[] | null
          is_popular?: boolean
          price_display: string
          price_note?: string | null
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          available_everywhere?: boolean
          booking_type?: string
          created_at?: string
          description?: string | null
          display_order?: number
          duration?: string | null
          icon_name?: string
          id?: string
          includes?: string[] | null
          is_popular?: boolean
          price_display?: string
          price_note?: string | null
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_adjust_credit: {
        Args: {
          p_amount: number
          p_description?: string
          p_target_user_id: string
          p_type?: string
        }
        Returns: Json
      }
      admin_approve_credit: {
        Args: { p_transaction_id: string }
        Returns: Json
      }
      admin_reject_credit: { Args: { p_transaction_id: string }; Returns: Json }
      admin_update_profile: {
        Args: {
          p_date_of_birth?: string
          p_emergency_contact_name?: string
          p_emergency_contact_phone?: string
          p_emergency_contact_relationship?: string
          p_full_name?: string
          p_phone?: string
          p_target_user_id: string
          p_tier_id?: string
          p_total_jumps?: number
        }
        Returns: Json
      }
      create_booking: {
        Args: {
          p_email?: string
          p_first_name?: string
          p_last_name?: string
          p_location_id?: string
          p_participants?: number
          p_payment_intent_id?: string
          p_phone?: string
          p_preferred_date?: string
          p_referral_code?: string
          p_selected_promos?: string[]
          p_service_id?: string
          p_special_requests?: string
          p_user_id?: string
        }
        Returns: Json
      }
      get_credit_balance: { Args: { _user_id: string }; Returns: number }
      get_pending_credit_balance: {
        Args: { _user_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      process_referral_credit: {
        Args: { p_booking_id: string; p_referral_code: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
