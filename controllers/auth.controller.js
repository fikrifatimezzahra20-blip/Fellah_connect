'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../models');

const SALT_ROUNDS = 10;

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}


async function register(req, res, next) {
  try {
    const { nom, telephone, email, motDePasse, region } = req.body;

    if (!nom || !telephone || !motDePasse) {
      return res.status(400).json({ message: 'nom, telephone et motDePasse sont requis.' });
    }

    const existant = await Utilisateur.findOne({ where: { telephone } });
    if (existant) {
      return res.status(400).json({ message: 'Ce numero de telephone est deja utilise.' });
    }

    const motDePasseHache = await bcrypt.hash(motDePasse, SALT_ROUNDS);

    const utilisateur = await Utilisateur.create({
      nom,
      telephone,
      email: email || null,
      motDePasse: motDePasseHache,
      region: region || null,
      role: 'agriculteur',
    });

    const token = generateToken(utilisateur);

    return res.status(201).json({
      user: utilisateur.toSafeJSON(),
      token,
    });
  } catch (err) {
    return next(err);
  }
}


async function login(req, res, next) {
  try {
    const { telephone, motDePasse } = req.body;

    if (!telephone || !motDePasse) {
      return res.status(400).json({ message: 'telephone et motDePasse sont requis.' });
    }

    const utilisateur = await Utilisateur.findOne({ where: { telephone } });
    if (!utilisateur) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const token = generateToken(utilisateur);

    return res.status(200).json({
      user: utilisateur.toSafeJSON(),
      token,
    });
  } catch (err) {
    return next(err);
  }
}


async function me(req, res, next) {
  try {
    const utilisateur = await Utilisateur.findByPk(req.user.id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouve.' });
    }
    return res.status(200).json({ user: utilisateur.toSafeJSON() });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, me };
