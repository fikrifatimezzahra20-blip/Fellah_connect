'use strict';

const { z } = require('zod');

const registerSchema = z.object({
  nom: z.string().min(1, 'nom est requis.'),
  telephone: z.string().min(1, 'telephone est requis.'),
  email: z.string().email('email invalide.').optional().nullable(),
  motDePasse: z.string().min(6, 'motDePasse doit contenir au moins 6 caracteres.'),
  region: z.string().optional().nullable(),
});

const loginSchema = z.object({
  telephone: z.string().min(1, 'telephone est requis.'),
  motDePasse: z.string().min(1, 'motDePasse est requis.'),
});

module.exports = { registerSchema, loginSchema };
