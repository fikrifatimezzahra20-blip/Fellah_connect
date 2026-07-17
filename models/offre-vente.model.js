'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OffreVente extends Model {
    static associate(models) {
      OffreVente.belongsTo(models.Recolte, {
        foreignKey: 'recolteId',
        as: 'recolte',
      });
      OffreVente.belongsTo(models.Marche, {
        foreignKey: 'marcheId',
        as: 'marche',
      });
    }
  }

  OffreVente.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quantite: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
      },
      prixDemande: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
      },
      statut: {
        type: DataTypes.ENUM('ouverte', 'acceptee', 'fermee'),
        allowNull: false,
        defaultValue: 'ouverte',
      },
      recolteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      marcheId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'OffreVente',
      tableName: 'offres_vente',
      timestamps: true,
    }
  );

  return OffreVente;
};
