'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PrixMarche extends Model {
    static associate(models) {
      PrixMarche.belongsTo(models.Produit, {
        foreignKey: 'produitId',
        as: 'produitRef',
        onDelete: 'SET NULL'
      });
      PrixMarche.belongsTo(models.Marche, {
        foreignKey: 'marcheId',
        as: 'marcheRef',
        onDelete: 'SET NULL'
      });
    }
  }

  PrixMarche.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      produit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      marche: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prix: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0.1 },
      },
      unite: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateReleve: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      produitId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      marcheId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'PrixMarche',
      tableName: 'prix_marches',
      timestamps: true,
    }
  );

  return PrixMarche;
};
