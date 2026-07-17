'use strict';

const { z } = require('zod');

const createPrixMarcheSchema = z.object({
  prix: z.number().positive('prix doit etre positif.'),
  dateReleve: z.string().min(1, 'dateReleve est requis.'),
  produit: z.string().optional(),
  marche: z.string().optional(),
  unite: z.string().optional(),
  produitId: z.number().int().positive().optional().nullable(),
  marcheId: z.number().int().positive().optional().nullable(),
}).refine(
  (data) => data.produit || data.produitId,
  { message: 'produit ou produitId est requis.', path: ['produit'] }
).refine(
  (data) => data.marche || data.marcheId,
  { message: 'marche ou marcheId est requis.', path: ['marche'] }
);

const updatePrixMarcheSchema = z.object({
  produit: z.string().optional(),
  marche: z.string().optional(),
  prix: z.number().positive().optional(),
  unite: z.string().optional(),
  dateReleve: z.string().optional(),
});

module.exports = { createPrixMarcheSchema, updatePrixMarcheSchema };
