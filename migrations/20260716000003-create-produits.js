'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Produits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Produits', ['createdAt'], {
      name: 'idx_produits_created_at'
    });
    await queryInterface.addIndex('Produits', ['updatedAt'], {
      name: 'idx_produits_updated_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Produits');
  }
};
