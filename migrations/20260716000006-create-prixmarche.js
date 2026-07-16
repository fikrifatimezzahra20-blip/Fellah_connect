'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PrixMarche', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pricePerKg: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      priceDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      marketId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Marches',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Produits',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('PrixMarche', ['marketId'], {
      name: 'idx_prixmarche_market_id'
    });
    await queryInterface.addIndex('PrixMarche', ['productId'], {
      name: 'idx_prixmarche_product_id'
    });
    await queryInterface.addIndex('PrixMarche', ['priceDate'], {
      name: 'idx_prixmarche_price_date'
    });
    await queryInterface.addIndex('PrixMarche', ['createdAt'], {
      name: 'idx_prixmarche_created_at'
    });
    await queryInterface.addIndex('PrixMarche', ['updatedAt'], {
      name: 'idx_prixmarche_updated_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PrixMarche');
  }
};
