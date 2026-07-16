'use strict';

const express = require('express');
const router = express.Router();

const { getFarmerParcelles } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.use(verifyToken);

router.get('/:id/parcelles', getFarmerParcelles);

module.exports = router;
