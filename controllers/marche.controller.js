'use strict';

const { Marche } = require('../models');

async function create(req, res, next) {
  try {
    const { nom, ville, region } = req.body;

    if (!nom || !ville || !region) {
      return res.status(400).json({ message: 'nom, ville et region sont requis.' });
    }

    const marche = await Marche.create({ nom, ville, region });
    return res.status(201).json({ marche });
  } catch (err) {
    return next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const where = {};
    if (req.query.region) {
      where.region = req.query.region;
    }

    const marches = await Marche.findAll({
      where,
      order: [['nom', 'ASC']],
    });

    return res.status(200).json({ marches });
  } catch (err) {
    return next(err);
  }
}

async function findOne(req, res, next) {
  try {
    const marche = await Marche.findByPk(req.params.id);
    if (!marche) {
      return res.status(404).json({ message: 'Marche non trouve.' });
    }
    return res.status(200).json({ marche });
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const marche = await Marche.findByPk(req.params.id);
    if (!marche) {
      return res.status(404).json({ message: 'Marche non trouve.' });
    }

    const { nom, ville, region } = req.body;

    await marche.update({
      ...(nom !== undefined && { nom }),
      ...(ville !== undefined && { ville }),
      ...(region !== undefined && { region }),
    });

    return res.status(200).json({ marche });
  } catch (err) {
    return next(err);
  }
}

async function destroy(req, res, next) {
  try {
    const marche = await Marche.findByPk(req.params.id);
    if (!marche) {
      return res.status(404).json({ message: 'Marche non trouve.' });
    }

    await marche.destroy();
    return res.status(200).json({ message: 'Marche supprime.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, findAll, findOne, update, destroy };
