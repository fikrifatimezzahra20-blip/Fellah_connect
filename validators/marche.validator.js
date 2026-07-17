'use strict';

const { z } = require('zod');

const createMarcheSchema = z.object({
  nom: z.string().min(1, 'nom est requis.'),
  ville: z.string().min(1, 'ville est requis.'),
  region: z.string().min(1, 'region est requis.'),
});

const updateMarcheSchema = z.object({
  nom: z.string().min(1).optional(),
  ville: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
});

module.exports = { createMarcheSchema, updateMarcheSchema };
