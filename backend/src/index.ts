export interface Env {
  GEMINI_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }
    
    try {
      if (!env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY secret is not set in the Worker.");
      }

      const body = await request.text();
      const accountId = "17fb070b38a0d99be193ac1aebf1f1dd";
      
      // Cloudflare AI Gateway URL routing to Gemini 1.5 Pro
      // Note: We need an AI Gateway named "midnight-gospel" created in the CF Dashboard.
      const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/midnight-gospel/google-ai-studio/v1beta/models/gemini-1.5-pro:generateContent?key=${env.GEMINI_API_KEY}`;
      
      const response = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      const data = await response.text();

      return new Response(data, {
        status: response.status,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        }
      });
    }
  }
};
