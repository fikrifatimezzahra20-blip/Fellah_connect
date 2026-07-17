'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('parcelles', [
      {
        id: 1,
        nom: 'Ferme Souss',
        superficie: 5.5,
        commune: 'Souss-Massa',
        agriculteurId: 1, // Hassan El Agriculteur
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        nom: 'Terre Chaouia',
        superficie: 12.0,
        commune: 'Chaouia',
        agriculteurId: 1, // Hassan El Agriculteur
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('parcelles', null, {});
  }
};
