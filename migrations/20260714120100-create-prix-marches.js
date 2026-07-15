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
      produit: { type: Sequelize.STRING, allowNull: false },
      marche: { type: Sequelize.STRING, allowNull: false },
      prix: { type: Sequelize.FLOAT, allowNull: false },
      unite: { type: Sequelize.STRING, allowNull: false, defaultValue: 'DH/kg' },
      dateReleve: { type: Sequelize.DATEONLY, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('prix_marches', ['produit'], {
      name: 'idx_prixmarches_produit',
    });
    await queryInterface.addIndex('prix_marches', ['produit', 'dateReleve'], {
      name: 'idx_prixmarches_produit_date',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('prix_marches');
  },
};
