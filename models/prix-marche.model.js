'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PrixMarche extends Model {
    static associate(models) {
      PrixMarche.belongsTo(models.Produit, {
        foreignKey: 'produitId',
        as: 'produitRef',
      });
      PrixMarche.belongsTo(models.Marche, {
        foreignKey: 'marcheId',
        as: 'marcheRef',
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
        validate: { min: 0 },
      },
      unite: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'DH/kg',
      },
      dateReleve: {
        type: DataTypes.DATEONLY,
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
