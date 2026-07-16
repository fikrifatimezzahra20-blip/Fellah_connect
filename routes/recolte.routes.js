const express = require('express');
const router = express.Router();
const recolteController = require('../controllers/recolte.controller');

router.get('/', recolteController.getAllRecoltes);
router.post('/', recolteController.createRecolte);

module.exports = router;