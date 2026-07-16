'use strict';

const { Produit } = require('../models');

async function create(req, res, next) {
  try {
    const { nom, categorie, unite } = req.body;

    if (!nom || !categorie) {
      return res.status(400).json({ message: 'nom et categorie sont requis.' });
    }

    const produit = await Produit.create({
      nom,
      categorie,
      unite: unite || 'kg',
    });

    return res.status(201).json({ produit });
  } catch (err) {
    return next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const where = {};
    if (req.query.categorie) {
      where.categorie = req.query.categorie;
    }

    const produits = await Produit.findAll({
      where,
      order: [['nom', 'ASC']],
    });

    return res.status(200).json({ produits });
  } catch (err) {
    return next(err);
  }
}

async function findOne(req, res, next) {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouve.' });
    }
    return res.status(200).json({ produit });
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouve.' });
    }

    const { nom, categorie, unite } = req.body;

    await produit.update({
      ...(nom !== undefined && { nom }),
      ...(categorie !== undefined && { categorie }),
      ...(unite !== undefined && { unite }),
    });

    return res.status(200).json({ produit });
  } catch (err) {
    return next(err);
  }
}

async function destroy(req, res, next) {
  try {
    const produit = await Produit.findByPk(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouve.' });
    }

    await produit.destroy();
    return res.status(200).json({ message: 'Produit supprime.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, findAll, findOne, update, destroy };
