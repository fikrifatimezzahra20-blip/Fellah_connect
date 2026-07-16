'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Parcelle extends Model {
    static associate(models) {
      Parcelle.belongsTo(models.Utilisateur, {
        foreignKey: 'utilisateurId',
        as: 'proprietaire',
      });
      Parcelle.hasMany(models.Recolte, {
        foreignKey: 'parcelleId',
        as: 'recoltes',
      });
    }
  }

  Parcelle.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      superficie: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
      },
      commune: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      utilisateurId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Parcelle',
      tableName: 'parcelles',
      timestamps: true,
    }
  );

  return Parcelle;
};
