'use strict';

const express = require('express');
const router = express.Router();

const { create, findAll, findOne, update, destroy } = require('../controllers/offre.controller');
const { verifyToken } = require('../middlewares/authenticate.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createOffreSchema, updateOffreSchema } = require('../validators/offre.validator');
const { idParamSchema } = require('../validators/params.validator');

router.use(verifyToken);

router.post('/', validate(createOffreSchema), create);
router.get('/', findAll);
router.get('/:id', validate(idParamSchema, 'params'), findOne);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateOffreSchema), update);
router.delete('/:id', validate(idParamSchema, 'params'), destroy);

module.exports = router;
