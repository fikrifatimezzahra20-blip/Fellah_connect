'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('produits', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      categorie: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unite: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'kg',
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

    await queryInterface.addIndex('produits', ['nom'], {
      unique: true,
      name: 'idx_produits_nom',
    });
    await queryInterface.addIndex('produits', ['categorie'], {
      name: 'idx_produits_categorie',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('produits');
  },
};
