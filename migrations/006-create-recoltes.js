'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recoltes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      quantiteKg: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      dateRecolte: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      statut: {
        type: Sequelize.ENUM('en_attente', 'disponible', 'vendue'),
        allowNull: false,
        defaultValue: 'en_attente',
      },
      parcelleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'parcelles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      produitId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'produits',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      produit: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Inconnu',
      },
      prixSouhaite: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      agriculteurId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'agriculteurs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('recoltes', ['statut'], {
      name: 'idx_recoltes_statut',
    });

    await queryInterface.addIndex('recoltes', ['agriculteurId'], {
      name: 'idx_recoltes_agriculteur_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('recoltes');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_recoltes_statut";'
    );
  },
};
