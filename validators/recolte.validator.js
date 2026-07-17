'use strict';

const { z } = require('zod');

const createRecolteSchema = z.object({
  quantiteKg: z.number().positive('quantiteKg doit etre positif.'),
  dateRecolte: z.string().datetime().optional().nullable(),
  statut: z.enum(['en_attente', 'disponible', 'vendue']).optional(),
  parcelleId: z.number().int().positive().optional().nullable(),
  produitId: z.number().int().positive().optional().nullable(),
  produit: z.string().optional().nullable(),
  prixSouhaite: z.number().positive().optional().nullable(),
});

const updateRecolteSchema = z.object({
  quantiteKg: z.number().positive().optional(),
  dateRecolte: z.string().datetime().optional(),
  statut: z.enum(['en_attente', 'disponible', 'vendue']).optional(),
  parcelleId: z.number().int().positive().optional().nullable(),
  produitId: z.number().int().positive().optional().nullable(),
  prixSouhaite: z.number().positive().optional().nullable(),
});

module.exports = { createRecolteSchema, updateRecolteSchema };
