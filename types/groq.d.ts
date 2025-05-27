declare module 'groq-sdk' {
  export default class Groq {
    constructor(options: { 
      apiKey: string; 
      dangerouslyAllowBrowser?: boolean;
    })
    chat: {
      completions: {
        create(params: {
          messages: Array<{ role: string; content: string }>;
          model: string;
          temperature?: number;
          max_tokens?: number;
        }): Promise<{
          choices: Array<{
            message?: { 
              role?: string; 
              content?: string | null 
            }
          }>
        }>
      }
    }
  }
}

// Import SupabaseClient type definition
declare module '@supabase/supabase-js' {
  export interface SupabaseClient {
    from(table: string): {
      select(columns?: string): Promise<{
        data: any[] | null;
        error: Error | null;
      }>;
      eq(column: string, value: any): Promise<{
        data: any[] | null;
        error: Error | null;
      }>;
    }
  }
} 