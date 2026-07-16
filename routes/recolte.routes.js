const express = require('express');
const router = express.Router();
const { create, findAll, findOne, update, destroy } = require('../controllers/recolte.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware'); // نفترض أن عندك هاد الـ Middleware
const validateRecolte = require('../middlewares/validateRecolte');
router.use(verifyToken);
router.get('/', findAll);
router.get('/:id', findOne);
router.put('/:id', validateRecolte, update); 
router.delete('/:id', requireRole('admin'), destroy);
module.exports = router;