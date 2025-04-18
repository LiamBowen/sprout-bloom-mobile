
import { supabase } from "@/integrations/supabase/client";

export async function logAnalyticsEvent(
  eventType: string, 
  eventData: Record<string, any> = {}
) {
  try {
    // Define parameters object
    const params = {
      p_event_type: eventType,
      p_event_data: eventData
    };

    // Call the RPC function without explicit type parameters
    const { data, error } = await supabase.functions.invoke('log_analytics_event', {
      body: params
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to log analytics event:', error);
  }
}
