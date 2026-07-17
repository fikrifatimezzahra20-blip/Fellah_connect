'use strict';

const express = require('express');
const router = express.Router();

const { create, findAll, findOne, update, destroy } = require('../controllers/parcelle.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createParcelleSchema, updateParcelleSchema } = require('../validators/parcelle.validator');
const { idParamSchema } = require('../validators/params.validator');

router.use(verifyToken);

router.post('/', validate(createParcelleSchema), create);
router.get('/', findAll);
router.get('/:id', validate(idParamSchema, 'params'), findOne);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateParcelleSchema), update);
router.delete('/:id', validate(idParamSchema, 'params'), destroy);

module.exports = router;
