const { Recolte } = require('../models');
exports.getAllRecoltes = async (req, res) => {
  try {
    const recoltes = await Recolte.findAll();
    res.status(200).json(recoltes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createRecolte = async (req, res) => {
  try {
    const { quantite, parcelleId, produitId } = req.body;
    const newRecolte = await Recolte.create({ quantite, parcelleId, produitId });
    res.status(201).json(newRecolte);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};