
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TRUELAYER_AUTH_URL = "https://auth.truelayer.com";
const TRUELAYER_API_URL = "https://api.truelayer.com";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to get environment variables with error handling
function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing ${name} environment variable`);
  }
  return value;
}

// Helper function to get a redirectUri with fallback
function getRedirectUri(req: Request, providedUri?: string): string {
  if (providedUri) {
    return providedUri;
  }
  
  const origin = req.headers.get('origin') || '';
  return `${origin}/app/bank-callback`;
}

// Helper function to create standardized responses
function createResponse(data: any, status = 200) {
  return new Response(
    JSON.stringify(data),
    { 
      status, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

// Generate authorization URL for TrueLayer
async function generateAuthLink(req: Request, redirectUri: string) {
  try {
    const clientId = getRequiredEnv('TRUELAYER_CLIENT_ID');
    const effectiveRedirectUri = getRedirectUri(req, redirectUri);
    
    console.log("TrueLayer generateAuthLink: Using redirect URI:", effectiveRedirectUri);
    
    // Build TrueLayer authorization URL with correct parameters
    const authUrl = new URL(`${TRUELAYER_AUTH_URL}/auth`);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('scope', 'info accounts balance transactions');
    authUrl.searchParams.append('redirect_uri', effectiveRedirectUri);
    authUrl.searchParams.append('providers', 'uk-oauth-all uk-ob-all');
    
    console.log('TrueLayer generateAuthLink: Generated auth URL:', authUrl.toString());
    
    return new Response(
      JSON.stringify({ authUrl: authUrl.toString(), success: true }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('Error generating auth link:', error);
    return createResponse({ 
      error: error.message, 
      success: false 
    }, 500);
  }
}

// Exchange authorization code for access token
async function exchangeToken(req: Request, code: string, redirectUri?: string) {
  try {
    if (!code) {
      throw new Error("Authorization code is required");
    }
    
    const clientId = getRequiredEnv('TRUELAYER_CLIENT_ID');
    const clientSecret = getRequiredEnv('TRUELAYER_CLIENT_SECRET');
    const effectiveRedirectUri = getRedirectUri(req, redirectUri);
    
    console.log('TrueLayer exchangeToken: Exchanging token with parameters:', {
      codeLength: code ? code.substring(0, 5) + '...' : 'missing',
      redirectUri: effectiveRedirectUri
    });
    
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
        redirect_uri: effectiveRedirectUri,
      }),
    });
    
    const data = await response.json();
    
    console.log('TrueLayer exchangeToken: Token exchange response status:', response.status);
    
    if (!response.ok) {
      console.error('TrueLayer exchangeToken: Token exchange failed:', JSON.stringify(data));
      throw new Error(data.error || 'Failed to exchange token');
    }
    
    console.log('TrueLayer exchangeToken: Token exchange successful');
    
    // Store bank connection in database
    await storeBankConnection(req);
    
    return createResponse({ 
      ...data,
      success: true 
    });
  } catch (error) {
    console.error('Error exchanging token:', error);
    return createResponse({ 
      error: error.message, 
      success: false 
    }, 500);
  }
}

// Store bank connection in database
async function storeBankConnection(req: Request) {
  try {
    const { supabaseClient } = await getSupabaseClient();
    
    // TODO: Fetch bank account details from TrueLayer API
    // For now, insert a placeholder record
    const { error } = await supabaseClient
      .from('bank_connections')
      .insert({
        provider: 'TrueLayer',
        account_id: `tl-${Date.now()}`,
        account_name: 'Connected Bank Account',
        account_type: 'Current Account',
        currency: 'GBP',
        user_id: extractUserIdFromRequest(req)
      });
    
    if (error) {
      console.error('Error storing bank connection:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error storing bank connection:', error);
    return false;
  }
}

// Helper function to get a Supabase client
async function getSupabaseClient() {
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.1');
  
  const supabaseUrl = getRequiredEnv('SUPABASE_URL');
  const supabaseServiceKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
  
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

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log("TrueLayer function received request:", JSON.stringify(requestData));
    const { action, code, redirectUri } = requestData;

    switch (action) {
      case 'generateAuthLink':
        return await generateAuthLink(req, redirectUri);
      case 'exchangeToken':
        return await exchangeToken(req, code, redirectUri);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in TrueLayer function:', error);
    return createResponse({ error: error.message }, 400);
  }
});
