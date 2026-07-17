'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const parcelles = await queryInterface.sequelize.query(`SELECT id FROM "Parcelles";`);
    const produits = await queryInterface.sequelize.query(`SELECT id FROM "Produits";`);
    
    if (!parcelles[0].length || !produits[0].length) return;

    const parcelleId = parcelles[0][0].id;
    const produitId = produits[0][0].id;
    
    const now = new Date();

    await queryInterface.bulkInsert('Recoltes', [
      {
        quantity: 500,
        harvestDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
        status: 'READY',
        parcelleId: parcelleId,
        produitId: produitId,
        createdAt: now,
        updatedAt: now
      },
      {
        quantity: 300,
        harvestDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
        status: 'READY',
        parcelleId: parcelles[0][1] ? parcelles[0][1].id : parcelleId,
        produitId: produits[0][1] ? produits[0][1].id : produitId,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Recoltes', null, {});
  }
};
