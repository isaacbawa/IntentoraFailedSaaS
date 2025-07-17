import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      teardowns: {
        Row: {
          id: string;
          name: string;
          market: string;
          revenue: string;
          duration: string;
          failure_reasons: string[];
          lessons_learned: string[];
          tags: string[];
          current_venture_name: string;
          current_venture_url: string;
          source_url: string;
          short_description: string;
          detailed_summary: string;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          status: string;
        };
        Insert: {
          id?: string;
          name: string;
          market: string;
          revenue: string;
          duration: string;
          failure_reasons?: string[];
          lessons_learned?: string[];
          tags?: string[];
          current_venture_name?: string;
          current_venture_url?: string;
          source_url?: string;
          short_description: string;
          detailed_summary: string;
          is_premium?: boolean;
          created_by?: string | null;
          status?: string;
        };
        Update: {
          id?: string;
          name?: string;
          market?: string;
          revenue?: string;
          duration?: string;
          failure_reasons?: string[];
          lessons_learned?: string[];
          tags?: string[];
          current_venture_name?: string;
          current_venture_url?: string;
          source_url?: string;
          short_description?: string;
          detailed_summary?: string;
          is_premium?: boolean;
          created_by?: string | null;
          status?: string;
        };
      };
      story_submissions: {
        Row: {
          id: string;
          startup_name: string;
          founder_name: string;
          email: string;
          market: string;
          duration: string;
          revenue: string;
          failure_reasons: string[];
          lessons_learned: string[];
          detailed_story: string;
          source_links: string;
          current_venture: string;
          current_venture_url: string;
          status: string;
          submitted_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          user_id: string | null;
          notes: string;
        };
        Insert: {
          id?: string;
          startup_name: string;
          founder_name: string;
          email: string;
          market: string;
          duration: string;
          revenue?: string;
          failure_reasons?: string[];
          lessons_learned?: string[];
          detailed_story: string;
          source_links?: string;
          current_venture?: string;
          current_venture_url?: string;
          status?: string;
          user_id?: string | null;
          notes?: string;
        };
        Update: {
          id?: string;
          startup_name?: string;
          founder_name?: string;
          email?: string;
          market?: string;
          duration?: string;
          revenue?: string;
          failure_reasons?: string[];
          lessons_learned?: string[];
          detailed_story?: string;
          source_links?: string;
          current_venture?: string;
          current_venture_url?: string;
          status?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          user_id?: string | null;
          notes?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          name: string;
          status: string;
          subscribed_at: string;
          unsubscribed_at: string | null;
          user_id: string | null;
          source: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string;
          status?: string;
          user_id?: string | null;
          source?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          status?: string;
          unsubscribed_at?: string | null;
          user_id?: string | null;
          source?: string;
        };
      };
      teardown_images: {
        Row: {
          id: string;
          teardown_id: string;
          image_url: string;
          alt_text: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          teardown_id: string;
          image_url: string;
          alt_text?: string;
          display_order?: number;
        };
        Update: {
          id?: string;
          teardown_id?: string;
          image_url?: string;
          alt_text?: string;
          display_order?: number;
        };
      };
      submission_images: {
        Row: {
          id: string;
          submission_id: string;
          image_url: string;
          alt_text: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          submission_id: string;
          image_url: string;
          alt_text?: string;
          display_order?: number;
        };
        Update: {
          id?: string;
          submission_id?: string;
          image_url?: string;
          alt_text?: string;
          display_order?: number;
        };
      };
    };
  };
}