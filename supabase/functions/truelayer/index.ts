
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
    const { action, code } = await req.json();

    switch (action) {
      case 'generateAuthLink':
        return await generateAuthLink(req);
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

async function generateAuthLink(req: Request) {
  try {
    const clientId = Deno.env.get('TRUELAYER_CLIENT_ID');
    if (!clientId) {
      throw new Error("Missing TRUELAYER_CLIENT_ID environment variable");
    }
    
    const redirectUri = `${req.headers.get('origin')}/app/profile`;
    
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
    
    const redirectUri = `${req.headers.get('origin')}/app/profile`;
    
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
