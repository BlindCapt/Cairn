/**
 * Supabase database types — PLACEHOLDER (empty schema).
 *
 * This file is generated, do not edit it by hand. Regenerate it after every migration:
 *   1. Log in once: `npx supabase login`
 *   2. Make sure the `db:types` script of package.json uses your project ref
 *      (Supabase dashboard > Project Settings > General > Project ID)
 *   3. Run `npm run db:types`
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: { [_ in never]: never };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
