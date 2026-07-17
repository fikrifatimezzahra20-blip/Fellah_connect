'use strict';

const { z } = require('zod');

/**
 * Common param schema — validates :id as a positive integer.
 */
const idParamSchema = z.object({
  id: z.coerce.number().int().positive({ message: 'id doit etre un entier positif.' }),
});

module.exports = { idParamSchema };
