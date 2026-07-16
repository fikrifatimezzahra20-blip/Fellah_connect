'use strict';

const express = require('express');
const router = express.Router();

const { create, findAll, findOne, update, destroy } = require('../controllers/offre-vente.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.post('/', create);
router.get('/', findAll);
router.get('/:id', findOne);
router.put('/:id', update);
router.delete('/:id', destroy);

module.exports = router;
