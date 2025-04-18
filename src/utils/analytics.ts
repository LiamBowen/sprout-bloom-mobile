
import { supabase } from "@/integrations/supabase/client";

export async function logAnalyticsEvent(
  eventType: string, 
  eventData: Record<string, any> = {}
) {
  try {
    // Explicitly type the RPC parameters to match the Supabase function
    type LogAnalyticsParams = {
      p_event_type: string;
      p_event_data: Record<string, any>;
    };

    const { data, error } = await supabase.rpc(
      'log_analytics_event',
      {
        p_event_type: eventType,
        p_event_data: eventData
      }
    );
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to log analytics event:', error);
  }
}
