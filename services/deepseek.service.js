'use strict';

const axios = require('axios');

// ── LLM client (Groq — free tier, OpenAI-compatible) ───────────
const llmClient = axios.create({
  baseURL: process.env.LLM_API_URL || 'https://api.groq.com/openai/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Set Authorization header dynamically (env may not be loaded at import time)
llmClient.interceptors.request.use((config) => {
  const apiKey =
    process.env.GROQ_API_KEY ||
    process.env.DEEPSEEK_API_KEY; // fallback for backwards compat
  config.headers.Authorization = `Bearer ${apiKey}`;
  return config;
});

/**
 * Send a simple chat message (no tools).
 * @param {Array<{role: string, content: string}>} messages
 * @returns {Promise<string>} The assistant's reply text
 */
async function sendChatMessage(messages) {
  const message = await sendChatCompletion(messages);
  if (!message.content) {
    throw new Error('Reponse LLM vide ou mal formee.');
  }
  return message.content;
}

/**
 * Send a chat completion request, optionally with tool definitions.
 * @param {Array} messages
 * @param {Array} [tools] - OpenAI-compatible tool definitions
 * @returns {Promise<object>} The assistant message object (may contain tool_calls)
 */
async function sendChatCompletion(messages, tools = undefined) {
  try {
    const body = {
      model: process.env.LLM_MODEL || 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.4,
    };

    if (tools && tools.length > 0) {
      body.tools = tools;
      body.tool_choice = 'auto';
    }

    const response = await llmClient.post('/chat/completions', body);
    const message = response.data?.choices?.[0]?.message;

    if (!message) {
      throw new Error('Reponse LLM vide ou mal formee.');
    }

    return message;
  } catch (err) {
    if (err.response) {
      console.error('Erreur LLM:', err.response.status, err.response.data);
      throw new Error(
        `Erreur LLM (${err.response.status}): ${JSON.stringify(err.response.data)}`
      );
    }
    throw err;
  }
}

module.exports = { sendChatMessage, sendChatCompletion };

