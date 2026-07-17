'use strict';

const { Recolte, Parcelle, Produit } = require('../models');

async function create(req, res, next) {
  try {
    const { quantiteKg, dateRecolte, statut, parcelleId, produitId, prixSouhaite, produit } = req.body;

    if (!quantiteKg) {
      return res.status(400).json({ message: 'quantiteKg est requis.' });
    }

    // If parcelleId is provided, verify ownership
    if (parcelleId) {
      const parcelle = await Parcelle.findByPk(parcelleId);
      if (!parcelle || parcelle.utilisateurId !== req.user.id) {
        return res.status(403).json({ message: 'Cette parcelle ne vous appartient pas.' });
      }
    }

    const recolte = await Recolte.create({
      quantiteKg,
      dateRecolte: dateRecolte || new Date(),
      statut: statut || 'en_attente',
      parcelleId: parcelleId || null,
      produitId: produitId || null,
      produit: produit || null,
      prixSouhaite: prixSouhaite || null,
      utilisateurId: req.user.id,
    });

    return res.status(201).json({ recolte });
  } catch (err) {
    return next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const where = { utilisateurId: req.user.id };

    if (req.query.statut) {
      where.statut = req.query.statut;
    }

    const recoltes = await Recolte.findAll({
      where,
      include: [
        { model: Parcelle, as: 'parcelle', required: false },
        { model: Produit, as: 'produit', required: false },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ recoltes });
  } catch (err) {
    return next(err);
  }
}

async function findOne(req, res, next) {
  try {
    const recolte = await Recolte.findByPk(req.params.id, {
      include: [
        { model: Parcelle, as: 'parcelle', required: false },
        { model: Produit, as: 'produit', required: false },
      ],
    });

    if (!recolte) {
      return res.status(404).json({ message: 'Recolte non trouvee.' });
    }
    if (recolte.utilisateurId !== req.user.id) {
      return res.status(403).json({ message: 'Acces refuse.' });
    }

    return res.status(200).json({ recolte });
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const recolte = await Recolte.findByPk(req.params.id);

    if (!recolte) {
      return res.status(404).json({ message: 'Recolte non trouvee.' });
    }
    if (recolte.utilisateurId !== req.user.id) {
      return res.status(403).json({ message: 'Acces refuse.' });
    }

    const { quantiteKg, dateRecolte, statut, parcelleId, produitId, prixSouhaite } = req.body;

    await recolte.update({
      ...(quantiteKg !== undefined && { quantiteKg }),
      ...(dateRecolte !== undefined && { dateRecolte }),
      ...(statut !== undefined && { statut }),
      ...(parcelleId !== undefined && { parcelleId }),
      ...(produitId !== undefined && { produitId }),
      ...(prixSouhaite !== undefined && { prixSouhaite }),
    });

    return res.status(200).json({ recolte });
  } catch (err) {
    return next(err);
  }
}

async function destroy(req, res, next) {
  try {
    const recolte = await Recolte.findByPk(req.params.id);

    if (!recolte) {
      return res.status(404).json({ message: 'Recolte non trouvee.' });
    }
    if (recolte.utilisateurId !== req.user.id) {
      return res.status(403).json({ message: 'Acces refuse.' });
    }

    await recolte.destroy();
    return res.status(200).json({ message: 'Recolte supprimee.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, findAll, findOne, update, destroy };
