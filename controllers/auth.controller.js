'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Agriculteur } = require('../models');

const SALT_ROUNDS = 10;

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function buildCombinedUserJSON(user, agriculteur) {
  return {
    id: user.id,
    nom: agriculteur ? agriculteur.nom : null,
    telephone: agriculteur ? agriculteur.telephone : null,
    email: user.email,
    role: user.role,
    region: agriculteur ? agriculteur.region : null,
    createdAt: user.createdAt,
  };
}

async function register(req, res, next) {
  try {
    const { nom, telephone, email, motDePasse, region } = req.body;

    if (!nom || !telephone || !motDePasse) {
      return res.status(400).json({ message: 'nom, telephone et motDePasse sont requis.' });
    }

    const existant = await Agriculteur.findOne({ where: { telephone } });
    if (existant) {
      return res.status(400).json({ message: 'Ce numero de telephone est deja utilise.' });
    }

    const motDePasseHache = await bcrypt.hash(motDePasse, SALT_ROUNDS);

    const user = await User.create({
      email: email || null,
      motDePasse: motDePasseHache,
      role: 'agriculteur',
    });

    const agriculteur = await Agriculteur.create({
      nom,
      telephone,
      region: region || null,
      userId: user.id,
    });

    const token = generateToken(user);

    return res.status(201).json({
      user: buildCombinedUserJSON(user, agriculteur),
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

    const agriculteur = await Agriculteur.findOne({ where: { telephone } });
    if (!agriculteur) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const user = await User.findByPk(agriculteur.userId);
    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const motDePasseValide = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Identifiants incorrects.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      user: buildCombinedUserJSON(user, agriculteur),
      token,
    });
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouve.' });
    }

    const agriculteur = await Agriculteur.findOne({ where: { userId: user.id } });

    return res.status(200).json({ user: buildCombinedUserJSON(user, agriculteur) });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, me };
