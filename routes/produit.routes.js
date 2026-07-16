'use strict';

const express = require('express');
const router = express.Router();

const { create, findAll, findOne, update, destroy, getMeilleurPrix } = require('../controllers/produit.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

router.use(verifyToken);

// Read — all authenticated users
router.get('/', findAll);
router.get('/:id', findOne);
router.get('/:id/meilleur-prix', getMeilleurPrix);

// Write — admin only
router.post('/', requireRole('admin'), create);
router.put('/:id', requireRole('admin'), update);
router.delete('/:id', requireRole('admin'), destroy);

module.exports = router;
