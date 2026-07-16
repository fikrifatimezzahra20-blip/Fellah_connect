'use strict';

const { PrixMarche, Produit, Marche } = require('../models');
const { Op } = require('sequelize');

async function create(req, res, next) {
  try {
    const { produit, marche, prix, unite, dateReleve, produitId, marcheId } = req.body;

    if (!prix || !dateReleve) {
      return res.status(400).json({ message: 'prix et dateReleve sont requis.' });
    }
    if (!produit && !produitId) {
      return res.status(400).json({ message: 'produit ou produitId est requis.' });
    }
    if (!marche && !marcheId) {
      return res.status(400).json({ message: 'marche ou marcheId est requis.' });
    }

    const prixMarche = await PrixMarche.create({
      produit: produit || '',
      marche: marche || '',
      prix,
      unite: unite || 'DH/kg',
      dateReleve,
      produitId: produitId || null,
      marcheId: marcheId || null,
    });

    return res.status(201).json({ prixMarche });
  } catch (err) {
    return next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const where = {};

    if (req.query.produit) {
      where.produit = { [Op.iLike]: `%${req.query.produit}%` };
    }
    if (req.query.marche) {
      where.marche = { [Op.iLike]: `%${req.query.marche}%` };
    }
    if (req.query.dateReleve) {
      where.dateReleve = req.query.dateReleve;
    }

    const prixMarches = await PrixMarche.findAll({
      where,
      include: [
        { model: Produit, as: 'produitRef', required: false },
        { model: Marche, as: 'marcheRef', required: false },
      ],
      order: [['dateReleve', 'DESC']],
      limit: parseInt(req.query.limit) || 100,
    });

    return res.status(200).json({ prixMarches });
  } catch (err) {
    return next(err);
  }
}

async function findOne(req, res, next) {
  try {
    const prixMarche = await PrixMarche.findByPk(req.params.id, {
      include: [
        { model: Produit, as: 'produitRef', required: false },
        { model: Marche, as: 'marcheRef', required: false },
      ],
    });

    if (!prixMarche) {
      return res.status(404).json({ message: 'Prix non trouve.' });
    }

    return res.status(200).json({ prixMarche });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/prix-marches/meilleur/:nomProduit
 * Find the best (highest) market price for a given product name.
 */
async function meilleurPrix(req, res, next) {
  try {
    const nomProduit = req.params.nomProduit;

    const meilleur = await PrixMarche.findOne({
      where: {
        produit: { [Op.iLike]: `%${nomProduit}%` },
      },
      order: [['prix', 'DESC']],
    });

    if (!meilleur) {
      return res.status(404).json({
        trouve: false,
        message: `Aucun prix trouve pour "${nomProduit}".`,
      });
    }

    return res.status(200).json({
      trouve: true,
      meilleurPrix: meilleur,
    });
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const prixMarche = await PrixMarche.findByPk(req.params.id);
    if (!prixMarche) {
      return res.status(404).json({ message: 'Prix non trouve.' });
    }

    const { produit, marche, prix, unite, dateReleve } = req.body;

    await prixMarche.update({
      ...(produit !== undefined && { produit }),
      ...(marche !== undefined && { marche }),
      ...(prix !== undefined && { prix }),
      ...(unite !== undefined && { unite }),
      ...(dateReleve !== undefined && { dateReleve }),
    });

    return res.status(200).json({ prixMarche });
  } catch (err) {
    return next(err);
  }
}

async function destroy(req, res, next) {
  try {
    const prixMarche = await PrixMarche.findByPk(req.params.id);
    if (!prixMarche) {
      return res.status(404).json({ message: 'Prix non trouve.' });
    }

    await prixMarche.destroy();
    return res.status(200).json({ message: 'Prix supprime.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, findAll, findOne, meilleurPrix, update, destroy };
