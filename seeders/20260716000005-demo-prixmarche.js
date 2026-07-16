'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const products = await queryInterface.sequelize.query(`SELECT id, name FROM "Produits";`);
    const markets = await queryInterface.sequelize.query(`SELECT id FROM "Marches";`);
    
    const productRows = products[0];
    const marketRows = markets[0];
    
    const prices = [];
    const now = new Date();
    
    // Generate base prices for products
    const basePrices = {
      'Tomatoes': 4.5,
      'Potatoes': 3.5,
      'Olives': 12.0,
      'Oranges': 4.0,
      'Mint': 1.5
    };

    for (let day = 14; day >= 1; day--) {
      const priceDate = new Date();
      priceDate.setDate(now.getDate() - day);
      
      for (const market of marketRows) {
        for (const product of productRows) {
          const base = basePrices[product.name] || 5.0;
          // Random fluctuation between -10% and +10%
          const fluctuation = base * (Math.random() * 0.2 - 0.1);
          const finalPrice = Math.max(0.5, (base + fluctuation)).toFixed(2);
          
          prices.push({
            pricePerKg: finalPrice,
            priceDate: priceDate,
            marketId: market.id,
            productId: product.id,
            createdAt: now,
            updatedAt: now
          });
        }
      }
    }

    await queryInterface.bulkInsert('PrixMarche', prices, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PrixMarche', null, {});
  }
};
