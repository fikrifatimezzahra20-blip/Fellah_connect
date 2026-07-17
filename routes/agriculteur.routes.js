'use strict';

const express = require('express');
const router = express.Router();

const { getFarmerParcelles } = require('../controllers/agriculteur.controller');
const { verifyToken } = require('../middlewares/authenticate.middleware');

router.use(verifyToken);

router.get('/:id/parcelles', getFarmerParcelles);

module.exports = router;
