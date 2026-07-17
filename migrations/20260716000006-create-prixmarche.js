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
      marcheId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Marches',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      produitId: {
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

    await queryInterface.addIndex('PrixMarche', ['marcheId'], {
      name: 'idx_prixmarche_marche_id'
    });
    await queryInterface.addIndex('PrixMarche', ['produitId'], {
      name: 'idx_prixmarche_produit_id'
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
