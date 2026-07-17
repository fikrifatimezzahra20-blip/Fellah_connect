'use strict';

const express = require('express');
const router = express.Router();

const { create, findAll, findOne, update, destroy } = require('../controllers/marche.controller');
const { verifyToken } = require('../middlewares/authenticate.middleware');
const { requireRole } = require('../middlewares/authorize.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createMarcheSchema, updateMarcheSchema } = require('../validators/marche.validator');
const { idParamSchema } = require('../validators/params.validator');

router.use(verifyToken);

// Read — all authenticated users
router.get('/', findAll);
router.get('/:id', validate(idParamSchema, 'params'), findOne);

// Write — admin only
router.post('/', requireRole('admin'), validate(createMarcheSchema), create);
router.put('/:id', requireRole('admin'), validate(idParamSchema, 'params'), validate(updateMarcheSchema), update);
router.delete('/:id', requireRole('admin'), validate(idParamSchema, 'params'), destroy);

module.exports = router;
