/**
 * Vercel Serverless Function - Google AI API Proxy
 * This function securely proxies requests to Google's Generative AI API
 * while keeping the API key secure on the server side.
 */

export default async function handler(req, res) {
  // Set CORS headers for frontend access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    // Get the API key from environment variables
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      console.error('Missing GOOGLE_AI_API_KEY environment variable');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'API key not configured'
      });
    }

    // Extract prompt from request body
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Prompt is required in the request body'
      });
    }

    // Validate prompt length (optional safety check)
    if (prompt.length > 10000) {
      return res.status(400).json({ 
        error: 'Bad request',
        message: 'Prompt is too long (max 10,000 characters)'
      });
    }

    // Google AI API endpoint (using Gemini Pro)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    // Prepare the request payload for Google AI
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    // Make the API call to Google AI
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    // Check if the API call was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Google AI API error:', response.status, errorData);
      
      return res.status(response.status).json({
        error: 'AI API error',
        message: errorData.error?.message || 'Failed to generate content',
        status: response.status
      });
    }

    // Parse the response from Google AI
    const data = await response.json();
    
    // Extract the generated text from the response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      console.error('Unexpected API response structure:', data);
      return res.status(500).json({
        error: 'API response error',
        message: 'No content generated or unexpected response format'
      });
    }

    // Return the successful response to the frontend
    return res.status(200).json({
      success: true,
      text: generatedText,
      usage: data.usageMetadata || null
    });

  } catch (error) {
    // Log the error for debugging (don't expose sensitive info to client)
    console.error('Serverless function error:', error);
    
    // Return a generic error response
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
}

/**
 * Configuration for Vercel
 * This ensures the function runs in the Node.js runtime
 */
export const config = {
  runtime: 'nodejs',
  maxDuration: 30, // Maximum execution time in seconds
};
