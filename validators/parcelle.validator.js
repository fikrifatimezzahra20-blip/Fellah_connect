'use strict';

const { z } = require('zod');

const createParcelleSchema = z.object({
  nom: z.string().min(1, 'nom est requis.'),
  superficie: z.number().positive('superficie doit etre positif.'),
  commune: z.string().min(1, 'commune est requis.'),
});

const updateParcelleSchema = z.object({
  nom: z.string().min(1).optional(),
  superficie: z.number().positive().optional(),
  commune: z.string().min(1).optional(),
});

module.exports = { createParcelleSchema, updateParcelleSchema };
