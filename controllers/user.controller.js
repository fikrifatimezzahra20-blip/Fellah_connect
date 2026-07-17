'use strict';

const { Utilisateur, Parcelle } = require('../models');

async function getFarmerParcelles(req, res, next) {
  try {
    const { id } = req.params;

    // Retrieve farmer (role 'agriculteur') with nested parcelles
    const farmer = await Utilisateur.findOne({
      where: { id, role: 'agriculteur' },
      include: [
        {
          model: Parcelle,
          as: 'parcelles',
          attributes: ['id', 'nom', 'superficie', 'commune']
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
      email: farmer.email,
      region: farmer.region,
      parcelles: farmer.parcelles
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getFarmerParcelles };
