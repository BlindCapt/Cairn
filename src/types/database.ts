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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      block_sessions: {
        Row: {
          day: string
          elapsed_seconds: number
          ended_at: string | null
          id: string
          item_id: string
          note: Json | null
          resumed_at: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["block_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          day: string
          elapsed_seconds?: number
          ended_at?: string | null
          id?: string
          item_id: string
          note?: Json | null
          resumed_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["block_status"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          day?: string
          elapsed_seconds?: number
          ended_at?: string | null
          id?: string
          item_id?: string
          note?: Json | null
          resumed_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["block_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "block_sessions_item_id_user_id_fkey"
            columns: ["item_id", "user_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      captures: {
        Row: {
          created_at: string
          done_at: string | null
          id: string
          original_date: string | null
          planned_date: string | null
          returned: boolean
          status: Database["public"]["Enums"]["capture_status"]
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          done_at?: string | null
          id?: string
          original_date?: string | null
          planned_date?: string | null
          returned?: boolean
          status?: Database["public"]["Enums"]["capture_status"]
          text: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          done_at?: string | null
          id?: string
          original_date?: string | null
          planned_date?: string | null
          returned?: boolean
          status?: Database["public"]["Enums"]["capture_status"]
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      day_profiles: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          position: number
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          position?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          position?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      item_checks: {
        Row: {
          checked_at: string
          day: string
          id: string
          item_id: string
          note: Json | null
          user_id: string
        }
        Insert: {
          checked_at?: string
          day: string
          id?: string
          item_id: string
          note?: Json | null
          user_id?: string
        }
        Update: {
          checked_at?: string
          day?: string
          id?: string
          item_id?: string
          note?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_checks_item_id_user_id_fkey"
            columns: ["item_id", "user_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      items: {
        Row: {
          archived_at: string | null
          created_at: string
          duration_min: number | null
          id: string
          label: string
          note_fields: string[]
          type: Database["public"]["Enums"]["item_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          duration_min?: number | null
          id?: string
          label: string
          note_fields?: string[]
          type?: Database["public"]["Enums"]["item_type"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          duration_min?: number | null
          id?: string
          label?: string
          note_fields?: string[]
          type?: Database["public"]["Enums"]["item_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_items: {
        Row: {
          created_at: string
          cue: string | null
          id: string
          item_id: string
          level: Database["public"]["Enums"]["item_level"]
          position: number
          profile_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cue?: string | null
          id?: string
          item_id: string
          level?: Database["public"]["Enums"]["item_level"]
          position?: number
          profile_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          cue?: string | null
          id?: string
          item_id?: string
          level?: Database["public"]["Enums"]["item_level"]
          position?: number
          profile_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_items_item_id_user_id_fkey"
            columns: ["item_id", "user_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id", "user_id"]
          },
          {
            foreignKeyName: "profile_items_profile_id_user_id_fkey"
            columns: ["profile_id", "user_id"]
            isOneToOne: false
            referencedRelation: "day_profiles"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      profile_overrides: {
        Row: {
          created_at: string
          day: string
          profile_id: string
          source: Database["public"]["Enums"]["override_source"]
          user_id: string
        }
        Insert: {
          created_at?: string
          day: string
          profile_id: string
          source?: Database["public"]["Enums"]["override_source"]
          user_id?: string
        }
        Update: {
          created_at?: string
          day?: string
          profile_id?: string
          source?: Database["public"]["Enums"]["override_source"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_overrides_profile_id_user_id_fkey"
            columns: ["profile_id", "user_id"]
            isOneToOne: false
            referencedRelation: "day_profiles"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
      week_schedule: {
        Row: {
          profile_id: string
          user_id: string
          weekday: number
        }
        Insert: {
          profile_id: string
          user_id?: string
          weekday: number
        }
        Update: {
          profile_id?: string
          user_id?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "week_schedule_profile_id_user_id_fkey"
            columns: ["profile_id", "user_id"]
            isOneToOne: false
            referencedRelation: "day_profiles"
            referencedColumns: ["id", "user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      return_overdue_captures: { Args: { today: string }; Returns: number }
    }
    Enums: {
      block_status: "todo" | "running" | "paused" | "done"
      capture_status: "inbox" | "planned" | "done" | "archived"
      item_level: "minimum" | "bonus"
      item_type: "task" | "block"
      override_source: "profiles" | "pill"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      block_status: ["todo", "running", "paused", "done"],
      capture_status: ["inbox", "planned", "done", "archived"],
      item_level: ["minimum", "bonus"],
      item_type: ["task", "block"],
      override_source: ["profiles", "pill"],
    },
  },
} as const
