'use strict';

const { OffreVente, Recolte, Marche } = require('../models');

async function create(req, res, next) {
  try {
    const { quantite, prixDemande, recolteId, marcheId } = req.body;

    if (!quantite || !prixDemande || !recolteId || !marcheId) {
      return res.status(400).json({
        message: 'quantite, prixDemande, recolteId et marcheId sont requis.',
      });
    }

    // Verify ownership of the recolte
    const recolte = await Recolte.findByPk(recolteId);
    if (!recolte) {
      return res.status(404).json({ message: 'Recolte non trouvee.' });
    }
    if (recolte.utilisateurId !== req.user.id) {
      return res.status(403).json({ message: 'Cette recolte ne vous appartient pas.' });
    }

    // Verify market exists
    const marche = await Marche.findByPk(marcheId);
    if (!marche) {
      return res.status(404).json({ message: 'Marche non trouve.' });
    }

    const offre = await OffreVente.create({
      quantite,
      prixDemande,
      statut: 'ouverte',
      recolteId,
      marcheId,
    });

    // Update recolte status to disponible
    if (recolte.statut === 'en_attente') {
      await recolte.update({ statut: 'disponible' });
    }

    return res.status(201).json({ offre });
  } catch (err) {
    return next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const where = {};
    if (req.query.statut) {
      where.statut = req.query.statut;
    }

    const offres = await OffreVente.findAll({
      where,
      include: [
        {
          model: Recolte,
          as: 'recolte',
          where: { utilisateurId: req.user.id },
          required: true,
        },
        { model: Marche, as: 'marche', required: false },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({ offres });
  } catch (err) {
    return next(err);
  }
}

async function findOne(req, res, next) {
  try {
    const offre = await OffreVente.findByPk(req.params.id, {
      include: [
        { model: Recolte, as: 'recolte' },
        { model: Marche, as: 'marche' },
      ],
    });

    if (!offre) {
      return res.status(404).json({ message: 'Offre non trouvee.' });
    }
    if (offre.recolte.utilisateurId !== req.user.id) {
      return res.status(403).json({ message: 'Acces refuse.' });
    }

    return res.status(200).json({ offre });
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const offre = await OffreVente.findByPk(req.params.id, {
      include: [{ model: Recolte, as: 'recolte' }],
    });

    if (!offre) {
      return res.status(404).json({ message: 'Offre non trouvee.' });
    }
    if (offre.recolte.utilisateurId !== req.user.id) {
      return res.status(403).json({ message: 'Acces refuse.' });
    }

    const { quantite, prixDemande, statut } = req.body;

    await offre.update({
      ...(quantite !== undefined && { quantite }),
      ...(prixDemande !== undefined && { prixDemande }),
      ...(statut !== undefined && { statut }),
    });

    // If offer is accepted, mark harvest as sold
    if (statut === 'acceptee') {
      await offre.recolte.update({ statut: 'vendue' });
    }

    return res.status(200).json({ offre });
  } catch (err) {
    return next(err);
  }
}

async function destroy(req, res, next) {
  try {
    const offre = await OffreVente.findByPk(req.params.id, {
      include: [{ model: Recolte, as: 'recolte' }],
    });

    if (!offre) {
      return res.status(404).json({ message: 'Offre non trouvee.' });
    }
    if (offre.recolte.utilisateurId !== req.user.id) {
      return res.status(403).json({ message: 'Acces refuse.' });
    }

    await offre.destroy();
    return res.status(200).json({ message: 'Offre supprimee.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, findAll, findOne, update, destroy };
