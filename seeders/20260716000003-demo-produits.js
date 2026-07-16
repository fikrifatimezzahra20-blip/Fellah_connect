'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('Produits', [
      { name: 'Tomatoes', category: 'Vegetable', unit: 'kg', createdAt: now, updatedAt: now },
      { name: 'Potatoes', category: 'Vegetable', unit: 'kg', createdAt: now, updatedAt: now },
      { name: 'Olives', category: 'Fruit', unit: 'kg', createdAt: now, updatedAt: now },
      { name: 'Oranges', category: 'Fruit', unit: 'kg', createdAt: now, updatedAt: now },
      { name: 'Mint', category: 'Herb', unit: 'bundle', createdAt: now, updatedAt: now }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Produits', null, {});
  }
};
