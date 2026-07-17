'use strict';

const jwt = require('jsonwebtoken');
const { Agriculteur } = require('../models');

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou mal forme.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test_secret');
    req.user = { id: decoded.id, role: decoded.role };

    if (decoded.role === 'agriculteur') {
      const agriculteur = await Agriculteur.findOne({ where: { userId: decoded.id } });
      if (agriculteur) {
        req.user.agriculteurId = agriculteur.id;
      }
    }
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expire.' });
  }
}

module.exports = { verifyToken };
