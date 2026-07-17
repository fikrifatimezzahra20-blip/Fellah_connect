'use strict';

const express = require('express');
const router = express.Router();

const { chat, resetMemory } = require('../controllers/agent.controller');
const { verifyToken } = require('../middlewares/authenticate.middleware');

router.post('/chat', verifyToken, chat);
router.delete('/memory', verifyToken, resetMemory);

module.exports = router;
