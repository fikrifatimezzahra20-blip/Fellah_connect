'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const products = await queryInterface.sequelize.query(`SELECT id, nom FROM "produits";`);
    const markets = await queryInterface.sequelize.query(`SELECT id, nom FROM "marches";`);
    
    const productRows = products[0];
    const marketRows = markets[0];
    
    const prices = [];
    const now = new Date();
    
    // Generate base prices for products (in French)
    const basePrices = {
      'Tomates': 4.5,
      'Pommes de terre': 3.5,
      'Olives': 12.0,
      'Oranges': 4.0,
      'Menthe': 1.5
    };

    for (let day = 14; day >= 1; day--) {
      const priceDate = new Date();
      priceDate.setDate(now.getDate() - day);
      
      for (const market of marketRows) {
        for (const product of productRows) {
          const base = basePrices[product.nom] || 5.0;
          // Random fluctuation between -10% and +10%
          const fluctuation = base * (Math.random() * 0.2 - 0.1);
          const finalPrice = Math.max(0.5, (base + fluctuation)).toFixed(2);
          
          prices.push({
            produit: product.nom,
            marche: market.nom,
            prix: parseFloat(finalPrice),
            unite: 'DH/kg',
            dateReleve: priceDate.toISOString().slice(0, 10), // DATEONLY format
            produitId: product.id,
            marcheId: market.id,
            createdAt: now,
            updatedAt: now
          });
        }
      }
    }

    await queryInterface.bulkInsert('prix_marches', prices, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('prix_marches', null, {});
  }
};
