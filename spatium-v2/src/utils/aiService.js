/**
 * AI API Service - Frontend helper for calling the Vercel serverless function
 * This service handles communication with your secure AI proxy endpoint
 */

import React, { useState } from 'react';

class AIService {
  constructor() {
    // Use environment variable for API endpoint or default to current domain
    this.baseUrl = import.meta.env.NODE_ENV === 'production' 
      ? '/api' // Vercel will handle this automatically
      : '/api'; // Use relative path for both Vite and Vercel dev
  }

  /**
   * Generate AI content using the secure proxy endpoint
   * @param {string} prompt - The prompt to send to the AI
   * @param {Object} options - Additional options for the request
   * @returns {Promise<string>} - The generated text response
   */
  async generateContent(prompt, options = {}) {
    try {
      // Validate input
      if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt is required and must be a string');
      }

      if (prompt.length > 10000) {
        throw new Error('Prompt is too long (max 10,000 characters)');
      }

      // Make the API call to our secure proxy
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          ...options 
        }),
      });

      // Parse the response
      const data = await response.json();

      // Handle error responses
      if (!response.ok) {
        throw new Error(data.message || `API error: ${response.status}`);
      }

      // Return the generated text
      return data.text;

    } catch (error) {
      // Re-throw with context for better error handling
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  /**
   * Generate content with retry logic for better reliability
   * @param {string} prompt - The prompt to send to the AI
   * @param {number} maxRetries - Maximum number of retry attempts
   * @returns {Promise<string>} - The generated text response
   */
  async generateContentWithRetry(prompt, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.generateContent(prompt);
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx)
        if (error.message.includes('400') || error.message.includes('401')) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  /**
   * Check if the AI service is available
   * @returns {Promise<boolean>} - True if service is available
   */
  async isAvailable() {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'OPTIONS'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Create a singleton instance
const aiService = new AIService();

export default aiService;

// Named exports for specific use cases
export { AIService };

/**
 * React hook for AI content generation
 * @returns {Object} - Hook object with generate function and state
 */
export function useAI() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const generate = async (prompt) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await aiService.generateContent(prompt);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generate,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}
