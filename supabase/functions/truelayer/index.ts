
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TRUELAYER_AUTH_URL = "https://auth.truelayer.com";
const TRUELAYER_API_URL = "https://api.truelayer.com";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { action, code, redirectUri } = requestData;

    switch (action) {
      case 'generateAuthLink':
        return await generateAuthLink(req, redirectUri);
      case 'exchangeToken':
        return await exchangeToken(req, code);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function generateAuthLink(req: Request, redirectUri: string) {
  try {
    const clientId = Deno.env.get('TRUELAYER_CLIENT_ID');
    if (!clientId) {
      throw new Error("Missing TRUELAYER_CLIENT_ID environment variable");
    }
    
    if (!redirectUri) {
      // Extract the origin from the request headers
      const origin = req.headers.get('origin') || '';
      // Set the default redirect URI to the callback page
      redirectUri = `${origin}/app/bank-callback`;
    }
    
    console.log("Using redirect URI:", redirectUri);
    
    // Build TrueLayer authorization URL with correct parameters
    const authUrl = new URL(`${TRUELAYER_AUTH_URL}/auth`);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('scope', 'info accounts balance transactions');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('providers', 'uk-oauth-all uk-ob-all');
    
    console.log('Generated auth URL:', authUrl.toString());
    
    return new Response(
      JSON.stringify({ 
        authUrl: authUrl.toString(),
        success: true 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error generating auth link:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

async function exchangeToken(req: Request, code: string) {
  try {
    if (!code) {
      throw new Error("Authorization code is required");
    }
    
    const clientId = Deno.env.get('TRUELAYER_CLIENT_ID');
    const clientSecret = Deno.env.get('TRUELAYER_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      throw new Error("Missing TrueLayer credentials");
    }
    
    // Extract the origin from the request headers
    const origin = req.headers.get('origin') || '';
    // Set the redirect URI to the callback page (must match what was used in the auth request)
    const redirectUri = `${origin}/app/bank-callback`;
    
    console.log('Exchanging token with code:', code);
    console.log('Redirect URI:', redirectUri);
    
    const response = await fetch(`${TRUELAYER_AUTH_URL}/connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Token exchange failed:', data);
      throw new Error(data.error || 'Failed to exchange token');
    }
    
    // Insert the bank connection into the database
    const { supabaseClient } = await getSupabaseClient();
    
    // TODO: Fetch bank account details from TrueLayer API
    // For now, insert a placeholder record
    const { error: insertError } = await supabaseClient
      .from('bank_connections')
      .insert({
        provider: 'TrueLayer',
        account_id: `tl-${Date.now()}`,
        account_name: 'Connected Bank Account',
        account_type: 'Current Account',
        currency: 'GBP',
        user_id: extractUserIdFromRequest(req)
      });
    
    if (insertError) {
      console.error('Error storing bank connection:', insertError);
    }
    
    return new Response(
      JSON.stringify({ 
        ...data,
        success: true 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error exchanging token:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Helper function to get a Supabase client
async function getSupabaseClient() {
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.1');
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  return { supabaseClient };
}

// Helper function to extract the user ID from the request authorization header
function extractUserIdFromRequest(req: Request): string {
  // This is a simplified example. In production, you'd properly decode the JWT
  // and extract the user's ID. For now, we'll use a placeholder.
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader) {
    // Return a placeholder or generate a random ID for demo purposes
    return crypto.randomUUID();
  }
  
  // In production, you'd decode the JWT and extract sub claim
  // For now, just return a placeholder
  return 'placeholder-user-id';
}
