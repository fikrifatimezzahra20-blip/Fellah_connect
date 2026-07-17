'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Produit extends Model {
    static associate(models) {
      Produit.hasMany(models.Recolte, {
        foreignKey: 'produitId',
        as: 'recoltes',
      });
      Produit.hasMany(models.PrixMarche, {
        foreignKey: 'produitId',
        as: 'prix',
      });
    }
  }

  Produit.init(
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
      categorie: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unite: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Produit',
      tableName: 'produits',
      timestamps: true,
    }
  );

  return Produit;
};
