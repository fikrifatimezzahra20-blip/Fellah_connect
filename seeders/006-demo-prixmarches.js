'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const prices = [];
    const now = new Date();
    
    // Hardcoded products and markets from our seeders
    const productRows = [
      { id: 1, nom: 'Tomates' },
      { id: 2, nom: 'Pommes de terre' },
      { id: 3, nom: 'Olives' },
      { id: 4, nom: 'Oranges' },
      { id: 5, nom: 'Menthe' }
    ];
    const marketRows = [
      { id: 1, nom: 'Souk Inezgane' },
      { id: 2, nom: 'Marché de Gros Kenitra' },
      { id: 3, nom: 'Souk Settat' },
      { id: 4, nom: 'Marché de Gros Marrakech' },
      { id: 5, nom: 'Souk Béni Mellal' }
    ];
    
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
          const fluctuation = base * (Math.random() * 0.2 - 0.1);
          const finalPrice = Math.max(0.5, (base + fluctuation)).toFixed(2);
          
          prices.push({
            produit: product.nom,
            marche: market.nom,
            prix: parseFloat(finalPrice),
            unite: 'DH/kg',
            dateReleve: priceDate.toISOString().slice(0, 10),
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
