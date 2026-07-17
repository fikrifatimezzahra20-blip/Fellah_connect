'use strict';

const { User, Agriculteur, Parcelle } = require('../models');

async function getFarmerParcelles(req, res, next) {
  try {
    const { id } = req.params;

    const farmer = await Agriculteur.findOne({
      where: { id },
      include: [
        {
          model: Parcelle,
          as: 'parcelles',
          attributes: ['id', 'nom', 'superficie', 'commune']
        },
        {
          model: User,
          as: 'user',
          attributes: ['email']
        }
      ]
    });

    if (!farmer) {
      return res.status(404).json({ message: 'Agriculteur non trouve.' });
    }

    return res.status(200).json({
      id: farmer.id,
      nom: farmer.nom,
      telephone: farmer.telephone,
      email: farmer.user ? farmer.user.email : null,
      region: farmer.region,
      parcelles: farmer.parcelles
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getFarmerParcelles };
