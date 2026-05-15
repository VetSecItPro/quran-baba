import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Public row types - what the client is ALLOWED to read.
// edit_token (pages) and release_token (sections) are intentionally absent:
// PostgREST denies them via column-level grants. Tokens live in client localStorage only.

export type Gender = "male" | "female";

export type PageRow = {
  id: string;
  mode: "memorial" | "living";
  gender: Gender;
  relationship_en: string;
  relationship_ar: string;
  name_en: string;
  name_ar: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

export type PageInsert = Omit<PageRow, "created_at"> & { edit_token: string };

export type SectionRow = {
  page_id: string;
  quarter: number;
  hizb: number;
  quarter_in_hizb: 1 | 2 | 3 | 4;
  status: "available" | "claimed" | "completed";
  claimant_name: string | null;
  claimant_dua: string | null;
  completed: boolean;
  claimed_at: string | null;
  updated_at: string;
};

export type Database = {
  quranbaba: {
    Tables: {
      pages: {
        Row: PageRow;
        Insert: PageInsert & { created_at?: string };
        Update: Partial<PageInsert>;
        Relationships: [];
      };
      sections: {
        Row: SectionRow;
        Insert: Partial<SectionRow> & { page_id: string; quarter: number; hizb: number; quarter_in_hizb: 1 | 2 | 3 | 4 };
        Update: Partial<SectionRow>;
        Relationships: [
          {
            foreignKeyName: "sections_page_id_fkey";
            columns: ["page_id"];
            isOneToOne: false;
            referencedRelation: "pages";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      claim_section: {
        Args: { p_page_id: string; p_quarter: number; p_name: string; p_dua: string | null; p_release_token: string };
        Returns: void;
      };
      release_section: {
        Args: { p_page_id: string; p_quarter: number; p_release_token: string };
        Returns: void;
      };
      complete_section: {
        Args: { p_page_id: string; p_quarter: number; p_release_token: string };
        Returns: void;
      };
      moderate_release: {
        Args: { p_page_id: string; p_quarter: number; p_edit_token: string };
        Returns: void;
      };
      delete_page: {
        Args: { p_page_id: string; p_edit_token: string };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local"
  );
}

let client: SupabaseClient<Database, "quranbaba"> | null = null;

export function supabase(): SupabaseClient<Database, "quranbaba"> {
  if (!client) {
    client = createClient<Database, "quranbaba">(url!, key!, {
      db: { schema: "quranbaba" },
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 5 } },
    });
  }
  return client;
}
