'use strict';

const { Parcelle } = require('../models');

async function create(req, res, next) {
  try {
    const { nom, superficie, commune } = req.body;

    if (!nom || !superficie || !commune) {
      return res.status(400).json({ message: 'nom, superficie et commune sont requis.' });
    }

    const parcelle = await Parcelle.create({
      nom,
      superficie,
      commune,
      agriculteurId: req.user.agriculteurId,
    });

    return res.status(201).json({ parcelle });
  } catch (err) {
    return next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const parcelles = await Parcelle.findAll({
      where: { agriculteurId: req.user.agriculteurId },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ parcelles });
  } catch (err) {
    return next(err);
  }
}

async function findOne(req, res, next) {
  try {
    const parcelle = await Parcelle.findByPk(req.params.id);

    if (!parcelle) {
      return res.status(404).json({ message: 'Parcelle non trouvee.' });
    }
    if (parcelle.agriculteurId !== req.user.agriculteurId) {
      return res.status(403).json({ message: 'Acces refuse.' });
    }

    return res.status(200).json({ parcelle });
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const parcelle = await Parcelle.findByPk(req.params.id);

    if (!parcelle) {
      return res.status(404).json({ message: 'Parcelle non trouvee.' });
    }
    if (parcelle.agriculteurId !== req.user.agriculteurId) {
      return res.status(403).json({ message: 'Acces refuse.' });
    }

    const { nom, superficie, commune } = req.body;

    await parcelle.update({
      ...(nom !== undefined && { nom }),
      ...(superficie !== undefined && { superficie }),
      ...(commune !== undefined && { commune }),
    });

    return res.status(200).json({ parcelle });
  } catch (err) {
    return next(err);
  }
}

async function destroy(req, res, next) {
  try {
    const parcelle = await Parcelle.findByPk(req.params.id);

    if (!parcelle) {
      return res.status(404).json({ message: 'Parcelle non trouvee.' });
    }
    if (parcelle.agriculteurId !== req.user.agriculteurId) {
      return res.status(403).json({ message: 'Acces refuse.' });
    }

    await parcelle.destroy();
    return res.status(200).json({ message: 'Parcelle supprimee.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, findAll, findOne, update, destroy };
