'use strict';

const express = require('express');
const router = express.Router();

const { register, login, me } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/authenticate.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', verifyToken, me);

module.exports = router;
