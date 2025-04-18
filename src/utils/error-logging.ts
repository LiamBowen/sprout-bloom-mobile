
import { supabase } from "@/integrations/supabase/client";

export async function logError(
  error: Error,
  context: Record<string, any> = {}
) {
  try {
    const { data, error: logError } = await supabase.rpc(
      'log_error',
      {
        error_message: error.message,
        error_stack: error.stack,
        context: context
      }
    );
    
    if (logError) throw logError;
    return data;
  } catch (logError) {
    console.error('Failed to log error:', logError);
  }
}
