'use strict';

const express = require('express');
const router = express.Router();

const { create, findAll, findOne, update, destroy } = require('../controllers/produit.controller');
const { verifyToken } = require('../middlewares/authenticate.middleware');
const { requireRole } = require('../middlewares/authorize.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createProduitSchema, updateProduitSchema } = require('../validators/produit.validator');
const { idParamSchema } = require('../validators/params.validator');

router.use(verifyToken);

router.get('/', findAll);
router.get('/:id', validate(idParamSchema, 'params'), findOne);

router.post('/', requireRole('admin'), validate(createProduitSchema), create);
router.put('/:id', requireRole('admin'), validate(idParamSchema, 'params'), validate(updateProduitSchema), update);
router.delete('/:id', requireRole('admin'), validate(idParamSchema, 'params'), destroy);

module.exports = router;
