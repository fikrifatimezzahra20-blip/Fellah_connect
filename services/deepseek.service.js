'use strict';

const axios = require('axios');

const deepseekClient = axios.create({
  baseURL: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Set Authorization header dynamically (env may not be loaded at import time)
deepseekClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${process.env.DEEPSEEK_API_KEY}`;
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
    throw new Error('Reponse DeepSeek vide ou mal formee.');
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
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      messages,
      temperature: 0.4,
    };

    if (tools && tools.length > 0) {
      body.tools = tools;
      body.tool_choice = 'auto';
    }

    const response = await deepseekClient.post('/chat/completions', body);
    const message = response.data?.choices?.[0]?.message;

    if (!message) {
      throw new Error('Reponse DeepSeek vide ou mal formee.');
    }

    return message;
  } catch (err) {
    if (err.response) {
      console.error('Erreur DeepSeek:', err.response.status, err.response.data);
      throw new Error(
        `Erreur DeepSeek (${err.response.status}): ${JSON.stringify(err.response.data)}`
      );
    }
    throw err;
  }
}

module.exports = { sendChatMessage, sendChatCompletion };
