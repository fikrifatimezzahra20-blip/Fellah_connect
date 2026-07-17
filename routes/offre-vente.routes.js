'use strict';

const express = require('express');
const router = express.Router();

const { create, findAll, findOne, update, destroy } = require('../controllers/offre-vente.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createOffreVenteSchema, updateOffreVenteSchema } = require('../validators/offre-vente.validator');
const { idParamSchema } = require('../validators/params.validator');

router.use(verifyToken);

router.post('/', validate(createOffreVenteSchema), create);
router.get('/', findAll);
router.get('/:id', validate(idParamSchema, 'params'), findOne);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateOffreVenteSchema), update);
router.delete('/:id', validate(idParamSchema, 'params'), destroy);

module.exports = router;
