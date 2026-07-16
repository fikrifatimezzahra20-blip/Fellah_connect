'use strict';

const { runAgentLoop } = require('../services/agent-loop.service');
const { AGENT_SYSTEM_PROMPT } = require('../prompts/agent.systemPrompt');
const memoryService = require('../services/memory.service');


async function chat(req, res, next) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Le champ "message" est requis.' });
    }

    const historique = memoryService.getHistorique(req.user.id);

    const messages = [
      { role: 'system', content: AGENT_SYSTEM_PROMPT },
      ...historique,
      { role: 'user', content: message },
    ];

    const { reply, toolsUsed, maxIterationsReached } = await runAgentLoop(messages, req.user);

    memoryService.ajouterEchange(req.user.id, message, reply);

    return res.status(200).json({
      reply,
      toolsUsed,
      ...(maxIterationsReached ? { maxIterationsReached: true } : {}),
    });
  } catch (err) {
    return next(err);
  }
}

async function resetMemory(req, res, next) {
  try {
    memoryService.reinitialiser(req.user.id);
    return res.status(200).json({ message: 'Memoire reinitialisee.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { chat, resetMemory };
