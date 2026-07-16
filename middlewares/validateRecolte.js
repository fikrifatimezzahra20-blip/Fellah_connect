module.exports = (req, res, next) => {
  const { quantite, parcelleId } = req.body;
  if (!quantite || typeof quantite !== 'number' || quantite <= 0) {
    return res.status(400).json({ message: "الكمية خاصها تكون رقم موجب" });
  }
  if (!parcelleId) {
    return res.status(400).json({ message: "خاصك تختار البارسيلا (Parcelle)" });
  }
  next();
};