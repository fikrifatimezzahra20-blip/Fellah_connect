'use strict';

/**
 * In-memory conversation history per user.
 * Key: userId, Value: Array of {role, content} messages.
 *
 * For production, this should be replaced with Redis or a database table.
 */
const conversations = new Map();

const MAX_HISTORY = 20; // Keep last 20 exchanges (40 messages)

/**
 * Get the conversation history for a user.
 * @param {number} userId
 * @returns {Array<{role: string, content: string}>}
 */
function getHistorique(userId) {
  return conversations.get(userId) || [];
}

/**
 * Add a user message and assistant reply to the conversation history.
 * @param {number} userId
 * @param {string} userMessage
 * @param {string} assistantReply
 */
function ajouterEchange(userId, userMessage, assistantReply) {
  if (!conversations.has(userId)) {
    conversations.set(userId, []);
  }

  const history = conversations.get(userId);
  history.push({ role: 'user', content: userMessage });
  history.push({ role: 'assistant', content: assistantReply });

  // Trim to last MAX_HISTORY exchanges
  while (history.length > MAX_HISTORY * 2) {
    history.shift();
  }
}

/**
 * Reset a user's conversation history.
 * @param {number} userId
 */
function reinitialiser(userId) {
  conversations.delete(userId);
}

module.exports = { getHistorique, ajouterEchange, reinitialiser };
