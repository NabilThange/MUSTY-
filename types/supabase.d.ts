import { Database } from '@supabase/types'

// Define the shape of your database tables
export interface StudyResourcesTable {
  id: number
  type: string
  content: string
  source: string
  year: number
  semester: number
  branch: string
}

// Generic Supabase client type definitions
declare module '@supabase/supabase-js' {
  export interface SupabaseClient {
    from(table: string): {
      select(columns?: string): Promise<{
        data: any[] | null;
        error: Error | null;
      }> & {
        eq(column: string, value: any): Promise<{
          data: any[] | null;
          error: Error | null;
        }>;
      };
      eq(column: string, value: any): {
        select(columns?: string): Promise<{
          data: any[] | null;
          error: Error | null;
        }>;
      };
    }
    auth: {
      getUser(): Promise<{
        data: { 
          user: any | null 
        };
        error: Error | null;
      }>;
    }
  }

  // Extend the Database type with your custom tables
  interface Database {
    public: {
      Tables: {
        study_resources: {
          Row: StudyResourcesTable
          Insert: Omit<StudyResourcesTable, 'id'>
          Update: Partial<Omit<StudyResourcesTable, 'id'>>
        }
      }
    }
  }
} 