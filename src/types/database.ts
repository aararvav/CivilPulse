export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "citizen" | "admin";

export type SubmissionStatus =
  | "new"
  | "under_review"
  | "planned"
  | "completed"
  | "rejected";

export type SubmissionCategory =
  | "education"
  | "roads"
  | "health"
  | "water"
  | "sanitation"
  | "other";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Relationships: [];
      };
      submissions: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          description: string;
          language: string | null;
          translated_text: string | null;
          category: string | null;
          ai_summary: string | null;
          priority_score: number;
          photo_url: string | null;
          latitude: number | null;
          longitude: number | null;
          ward: string | null;
          status: SubmissionStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          description: string;
          language?: string | null;
          translated_text?: string | null;
          category?: string | null;
          ai_summary?: string | null;
          priority_score?: number;
          photo_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          ward?: string | null;
          status?: SubmissionStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          description?: string;
          language?: string | null;
          translated_text?: string | null;
          category?: string | null;
          ai_summary?: string | null;
          priority_score?: number;
          photo_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          ward?: string | null;
          status?: SubmissionStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      themes: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          submission_count: number;
          avg_priority: number;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          submission_count?: number;
          avg_priority?: number;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          submission_count?: number;
          avg_priority?: number;
        };
        Relationships: [];
      };
      submission_themes: {
        Row: {
          submission_id: string;
          theme_id: string;
        };
        Insert: {
          submission_id: string;
          theme_id: string;
        };
        Update: {
          submission_id?: string;
          theme_id?: string;
        };
        Relationships: [];
      };
      datasets: {
        Row: {
          id: string;
          ward: string | null;
          metric_name: string | null;
          metric_value: number | null;
          source: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ward?: string | null;
          metric_name?: string | null;
          metric_value?: number | null;
          source?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ward?: string | null;
          metric_name?: string | null;
          metric_value?: number | null;
          source?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Submission = Database["public"]["Tables"]["submissions"]["Row"];
