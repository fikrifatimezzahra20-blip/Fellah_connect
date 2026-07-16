'use strict';

const express = require('express');
const router = express.Router();

const { create, findAll, findOne, meilleurPrix, update, destroy } = require('../controllers/prix-marche.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

router.use(verifyToken);

// Read — all authenticated users
router.get('/', findAll);
router.get('/meilleur/:nomProduit', meilleurPrix);
router.get('/:id', findOne);

// Write — admin only
router.post('/', requireRole('admin'), create);
router.put('/:id', requireRole('admin'), update);
router.delete('/:id', requireRole('admin'), destroy);

module.exports = router;
