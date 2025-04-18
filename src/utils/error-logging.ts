
import { supabase } from "@/integrations/supabase/client";

export async function logError(
  error: Error,
  context: Record<string, any> = {}
) {
  try {
    // Define parameters object
    const params = {
      p_error_message: error.message,
      p_error_stack: error.stack || '',
      p_context: context
    };

    // Call the RPC function without explicit type parameters
    const { data, error: logError } = await supabase.functions.invoke('log_error', {
      body: params
    });
    
    if (logError) throw logError;
    return data;
  } catch (logError) {
    console.error('Failed to log error:', logError);
  }
}
