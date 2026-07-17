'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('marches', [
      { nom: 'Souk Inezgane', ville: 'Inezgane', region: 'Souss-Massa', createdAt: now, updatedAt: now },
      { nom: 'Marché de Gros Kenitra', ville: 'Kenitra', region: 'Gharb', createdAt: now, updatedAt: now },
      { nom: 'Souk Settat', ville: 'Settat', region: 'Chaouia', createdAt: now, updatedAt: now }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('marches', null, {});
  }
};
