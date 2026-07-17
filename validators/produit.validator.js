'use strict';

const { z } = require('zod');

const createProduitSchema = z.object({
  nom: z.string().min(1, 'nom est requis.'),
  categorie: z.string().min(1, 'categorie est requis.'),
  unite: z.string().optional(),
});

const updateProduitSchema = z.object({
  nom: z.string().min(1).optional(),
  categorie: z.string().min(1).optional(),
  unite: z.string().optional(),
});

module.exports = { createProduitSchema, updateProduitSchema };
