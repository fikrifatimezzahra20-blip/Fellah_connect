module.exports = (sequelize, DataTypes) => {
  const Recolte = sequelize.define('Recolte', {
    quantite: DataTypes.FLOAT,
    dateRecolte: DataTypes.DATE
  });
  Recolte.associate = (models) => {
    Recolte.belongsTo(models.Parcelle);
  };
  return Recolte;
};