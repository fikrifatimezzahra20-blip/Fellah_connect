'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('produits', [
      { id: 1, nom: 'Tomates', categorie: 'Légume', unite: 'kg', createdAt: now, updatedAt: now },
      { id: 2, nom: 'Pommes de terre', categorie: 'Légume', unite: 'kg', createdAt: now, updatedAt: now },
      { id: 3, nom: 'Olives', categorie: 'Fruit', unite: 'kg', createdAt: now, updatedAt: now },
      { id: 4, nom: 'Oranges', categorie: 'Fruit', unite: 'kg', createdAt: now, updatedAt: now },
      { id: 5, nom: 'Menthe', categorie: 'Herbe', unite: 'botte', createdAt: now, updatedAt: now }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('produits', null, {});
  }
};
