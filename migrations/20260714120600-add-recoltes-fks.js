'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add parcelleId FK column
    await queryInterface.addColumn('recoltes', 'parcelleId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'parcelles', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add produitId FK column
    await queryInterface.addColumn('recoltes', 'produitId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'produits', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // Add dateRecolte column
    await queryInterface.addColumn('recoltes', 'dateRecolte', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addIndex('recoltes', ['parcelleId'], {
      name: 'idx_recoltes_parcelle',
    });
    await queryInterface.addIndex('recoltes', ['produitId'], {
      name: 'idx_recoltes_produit_fk',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('recoltes', 'idx_recoltes_produit_fk');
    await queryInterface.removeIndex('recoltes', 'idx_recoltes_parcelle');
    await queryInterface.removeColumn('recoltes', 'dateRecolte');
    await queryInterface.removeColumn('recoltes', 'produitId');
    await queryInterface.removeColumn('recoltes', 'parcelleId');
  },
};
