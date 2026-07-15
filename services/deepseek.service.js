'use strict';

const axios = require('axios');

const deepseekClient = axios.create({
  baseURL: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions',
  headers: {
    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * @param {Array<{role: string, content: string}>} messages
 * @returns {Promise<string>}
 */
async function sendChatMessage(messages) {
  const message = await sendChatCompletion(messages);
  if (!message.content) {
    throw new Error('Reponse DeepSeek vide ou mal formee.');
  }
  return message.content;
}

/**
 * @param {Array} messages 
 * @param {Array} [tools] 
 * @returns {Promise<object>} 
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

    const response = await deepseekClient.post('', body);
    const message = response.data?.choices?.[0]?.message;

    if (!message) {
      throw new Error('Reponse DeepSeek vide ou mal formee.');
    }

    return message;
  } catch (err) {
    if (err.response) {
      console.error('Erreur DeepSeek:', err.response.status, err.response.data);
      throw new Error(`Erreur DeepSeek (${err.response.status}): ${JSON.stringify(err.response.data)}`);
    }
    throw err;
  }
}

module.exports = { sendChatMessage, sendChatCompletion };
