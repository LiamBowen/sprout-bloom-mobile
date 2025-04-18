
import { supabase } from "@/integrations/supabase/client";

export async function logError(
  error: Error,
  context: Record<string, any> = {}
) {
  try {
    // Explicitly type the RPC parameters to match the Supabase function
    type LogErrorParams = {
      p_error_message: string;
      p_error_stack: string;
      p_context: Record<string, any>;
    };

    const { data, error: logError } = await supabase.rpc<any>(
      'log_error',
      {
        p_error_message: error.message,
        p_error_stack: error.stack || '',
        p_context: context
      } as LogErrorParams
    );
    
    if (logError) throw logError;
    return data;
  } catch (logError) {
    console.error('Failed to log error:', logError);
  }
}
