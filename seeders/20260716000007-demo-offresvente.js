'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const recoltes = await queryInterface.sequelize.query(`SELECT id FROM "Recoltes";`);
    const marches = await queryInterface.sequelize.query(`SELECT id FROM "Marches";`);
    
    if (!recoltes[0].length || !marches[0].length) return;

    const recolteId = recoltes[0][0].id;
    const marcheId = marches[0][0].id;
    
    const now = new Date();

    await queryInterface.bulkInsert('OffresVente', [
      {
        quantity: 200,
        askingPrice: 5.5,
        status: 'OPEN',
        recolteId: recolteId,
        marcheId: marcheId,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('OffresVente', null, {});
  }
};
