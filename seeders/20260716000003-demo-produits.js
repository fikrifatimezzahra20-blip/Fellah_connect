'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('produits', [
      { nom: 'Tomates', categorie: 'Légume', unite: 'kg', createdAt: now, updatedAt: now },
      { nom: 'Pommes de terre', categorie: 'Légume', unite: 'kg', createdAt: now, updatedAt: now },
      { nom: 'Olives', categorie: 'Fruit', unite: 'kg', createdAt: now, updatedAt: now },
      { nom: 'Oranges', categorie: 'Fruit', unite: 'kg', createdAt: now, updatedAt: now },
      { nom: 'Menthe', categorie: 'Herbe', unite: 'botte', createdAt: now, updatedAt: now }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('produits', null, {});
  }
};
