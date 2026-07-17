'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Offre extends Model {
    static associate(models) {
      Offre.belongsTo(models.Recolte, {
        foreignKey: 'recolteId',
        as: 'recolte',
        onDelete: 'CASCADE'
      });
      Offre.belongsTo(models.Marche, {
        foreignKey: 'marcheId',
        as: 'marche',
        onDelete: 'CASCADE'
      });
    }
  }

  Offre.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quantite: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0.1 },
      },
      prixDemande: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0.1 },
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
      modelName: 'Offre',
      tableName: 'offres',
      timestamps: true,
    }
  );

  return Offre;
};
