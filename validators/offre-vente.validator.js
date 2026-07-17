'use strict';

const { z } = require('zod');

const createOffreVenteSchema = z.object({
  quantite: z.number().positive('quantite doit etre positif.'),
  prixDemande: z.number().positive('prixDemande doit etre positif.'),
  recolteId: z.number().int().positive('recolteId est requis.'),
  marcheId: z.number().int().positive('marcheId est requis.'),
});

const updateOffreVenteSchema = z.object({
  quantite: z.number().positive().optional(),
  prixDemande: z.number().positive().optional(),
  statut: z.enum(['ouverte', 'acceptee', 'fermee']).optional(),
});

module.exports = { createOffreVenteSchema, updateOffreVenteSchema };
