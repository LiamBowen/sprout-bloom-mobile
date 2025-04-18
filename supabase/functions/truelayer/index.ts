
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
    const { action } = await req.json();

    switch (action) {
      case 'generateAuthLink':
        return await generateAuthLink(req);
      case 'exchangeToken':
        return await exchangeToken(req);
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
  const clientId = Deno.env.get('TRUELAYER_CLIENT_ID');
  const redirectUri = `${req.headers.get('origin')}/app/profile`;

  // Using the correct TrueLayer authorization URL
  const authUrl = new URL(`${TRUELAYER_AUTH_URL}/connect/token`);
  authUrl.searchParams.append('client_id', clientId!);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'info accounts balance cards transactions');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('providers', 'uk-ob-all uk-oauth-all');

  console.log('Generated auth URL:', authUrl.toString());

  return new Response(
    JSON.stringify({ authUrl: authUrl.toString() }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function exchangeToken(req: Request) {
  const { code } = await req.json();
  const clientId = Deno.env.get('TRUELAYER_CLIENT_ID');
  const clientSecret = Deno.env.get('TRUELAYER_CLIENT_SECRET');
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
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
