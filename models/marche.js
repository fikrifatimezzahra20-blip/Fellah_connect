'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Marche extends Model {
    static associate(models) {
      Marche.hasMany(models.Offre, {
        foreignKey: 'marcheId',
        as: 'offres',
      });
      Marche.hasMany(models.PrixMarche, {
        foreignKey: 'marcheId',
        as: 'prix',
      });
    }
  }

  Marche.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ville: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      region: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Marche',
      tableName: 'marches',
      timestamps: true,
    }
  );

  return Marche;
};
