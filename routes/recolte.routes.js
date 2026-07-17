'use strict';

const express = require('express');
const router = express.Router();

const { create, findAll, findOne, update, destroy } = require('../controllers/recolte.controller');
const { verifyToken } = require('../middlewares/authenticate.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createRecolteSchema, updateRecolteSchema } = require('../validators/recolte.validator');
const { idParamSchema } = require('../validators/params.validator');

router.use(verifyToken);

router.get('/', findAll);
router.get('/:id', validate(idParamSchema, 'params'), findOne);

router.post('/', validate(createRecolteSchema), create);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateRecolteSchema), update);
router.delete('/:id', validate(idParamSchema, 'params'), destroy);

module.exports = router;
