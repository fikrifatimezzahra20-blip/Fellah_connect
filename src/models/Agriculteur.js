const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agriculteur extends Model {
    static associate(models) {
      Agriculteur.hasMany(models.Parcelle, { 
        foreignKey: 'agriculteurId' 
      });
    }
  }

  Agriculteur.init({
    nom: DataTypes.STRING,
    telephone: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Agriculteur',
  });

  return Agriculteur;
};