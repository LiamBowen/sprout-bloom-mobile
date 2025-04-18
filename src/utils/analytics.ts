
import { supabase } from "@/integrations/supabase/client";

export async function logAnalyticsEvent(
  eventType: string, 
  eventData: Record<string, any> = {}
) {
  try {
    const { data, error } = await supabase.rpc(
      'log_analytics_event',
      {
        event_type: eventType,
        event_data: eventData
      }
    );
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to log analytics event:', error);
  }
}
