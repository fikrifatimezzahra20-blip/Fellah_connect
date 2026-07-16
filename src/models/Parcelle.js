module.exports = (sequelize, DataTypes) => {
  const Parcelle = sequelize.define('Parcelle', {
    surface: DataTypes.FLOAT,
    localisation: DataTypes.STRING
  });
  Parcelle.associate = (models) => {
    Parcelle.belongsTo(models.Agriculteur);
  };
  return Parcelle;
};