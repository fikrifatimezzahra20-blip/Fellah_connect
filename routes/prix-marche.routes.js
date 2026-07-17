'use strict';

const express = require('express');
const router = express.Router();

const { create, findAll, findOne, meilleurPrix, update, destroy } = require('../controllers/prix-marche.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createPrixMarcheSchema, updatePrixMarcheSchema } = require('../validators/prix-marche.validator');
const { idParamSchema } = require('../validators/params.validator');

router.use(verifyToken);

// Read — all authenticated users
router.get('/', findAll);
router.get('/meilleur/:nomProduit', meilleurPrix);
router.get('/:id', validate(idParamSchema, 'params'), findOne);

// Write — admin only
router.post('/', requireRole('admin'), validate(createPrixMarcheSchema), create);
router.put('/:id', requireRole('admin'), validate(idParamSchema, 'params'), validate(updatePrixMarcheSchema), update);
router.delete('/:id', requireRole('admin'), validate(idParamSchema, 'params'), destroy);

module.exports = router;
