'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('prix_marches', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      produit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      marche: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      prix: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      unite: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateReleve: {
        type: Sequelize.DATE,
        allowNull: false,
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
      marcheId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'marches',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    await queryInterface.addIndex('prix_marches', ['produitId'], {
      name: 'idx_prix_marches_produit_id',
    });

    await queryInterface.addIndex('prix_marches', ['marcheId'], {
      name: 'idx_prix_marches_marche_id',
    });

    await queryInterface.addIndex('prix_marches', ['produitId', 'marcheId', 'dateReleve'], {
      name: 'idx_prix_marches_composite',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('prix_marches');
  },
};
