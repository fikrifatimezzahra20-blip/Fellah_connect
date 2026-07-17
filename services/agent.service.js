'use strict';

const { sendChatCompletion } = require('./deepseek.service');
const { TOOL_DEFINITIONS, executeTool } = require('../tools/agent.tools');

const MAX_ITERATIONS = 5;

/**
 * Run the agentic tool-calling loop:
 *  1. Send messages (with tool definitions) to DeepSeek
 *  2. If the response contains tool_calls, execute each tool
 *  3. Append tool results and re-send to DeepSeek
 *  4. Repeat until we get a text reply or hit MAX_ITERATIONS
 *
 * @param {Array} messages - Conversation messages (system + history + user)
 * @param {object} user - Authenticated user { id, role }
 * @returns {Promise<{reply: string, toolsUsed: string[], maxIterationsReached: boolean}>}
 */
async function runAgentLoop(messages, user) {
  const toolsUsed = [];
  let iterations = 0;

  const conversationMessages = [...messages];

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    const assistantMessage = await sendChatCompletion(
      conversationMessages,
      TOOL_DEFINITIONS
    );

    if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
      return {
        reply: assistantMessage.content || 'Je n\'ai pas pu generer de reponse.',
        toolsUsed,
        maxIterationsReached: false,
      };
    }

    conversationMessages.push(assistantMessage);

    for (const toolCall of assistantMessage.tool_calls) {
      const toolName = toolCall.function.name;
      let args = {};

      try {
        args = JSON.parse(toolCall.function.arguments || '{}');
      } catch (e) {
        args = {};
      }

      toolsUsed.push(toolName);

      const result = await executeTool(toolName, args, user);

      conversationMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }
  }

  const finalMessage = await sendChatCompletion(conversationMessages);

  return {
    reply:
      finalMessage.content ||
      'Desole, le traitement a pris trop de temps. Essayez de simplifier votre demande.',
    toolsUsed,
    maxIterationsReached: true,
  };
}

module.exports = { runAgentLoop };
