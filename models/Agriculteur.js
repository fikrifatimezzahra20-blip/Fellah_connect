module.exports = (sequelize, DataTypes) => {
  const Agriculteur = sequelize.define('Agriculteur', {
    nom: DataTypes.STRING,
    email: DataTypes.STRING
  });
  return Agriculteur;
};