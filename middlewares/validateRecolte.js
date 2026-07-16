const { z } = require('zod');ç
const recolteSchema = z.object({
  quantite: z.number().positive("Quantity must be a positive number"),
  parcelleId: z.number().int().positive("Parcelle ID is required and must be a valid number"),
  produitId: z.number().int().positive("Produit ID is required and must be a valid number")
});

const validateRecolte = (req, res, next) => {
  try {
    recolteSchema.parse(req.body); 
    next();
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      errors: error.errors.map(e => e.message) 
    });
  }
};

module.exports = validateRecolte;