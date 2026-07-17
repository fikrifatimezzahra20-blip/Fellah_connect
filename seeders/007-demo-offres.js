'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('offres', [
      {
        id: 1,
        quantite: 200.0,
        prixDemande: 5.5,
        statut: 'ouverte',
        recolteId: 1,
        marcheId: 1,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('offres', null, {});
  }
};
