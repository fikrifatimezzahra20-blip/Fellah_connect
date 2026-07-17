'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('recoltes', [
      {
        id: 1,
        quantiteKg: 500.0,
        dateRecolte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
        statut: 'en_attente',
        parcelleId: 1,
        produitId: 1, // Tomates
        produit: 'Tomates',
        agriculteurId: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        quantiteKg: 300.0,
        dateRecolte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
        statut: 'en_attente',
        parcelleId: 1,
        produitId: 2, // Pommes de terre
        produit: 'Pommes de terre',
        agriculteurId: 1,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('recoltes', null, {});
  }
};
