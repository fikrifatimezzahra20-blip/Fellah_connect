'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recoltes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      utilisateurId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'utilisateurs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      produit: { type: Sequelize.STRING, allowNull: false },
      quantiteKg: { type: Sequelize.FLOAT, allowNull: false },
      statut: {
        type: Sequelize.ENUM('en_attente', 'disponible', 'vendue'),
        allowNull: false,
        defaultValue: 'en_attente',
      },
      prixSouhaite: { type: Sequelize.FLOAT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('recoltes', ['utilisateurId'], {
      name: 'idx_recoltes_utilisateur',
    });
    await queryInterface.addIndex('recoltes', ['produit'], {
      name: 'idx_recoltes_produit',
    });
    await queryInterface.addIndex('recoltes', ['statut'], {
      name: 'idx_recoltes_statut',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('recoltes');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_recoltes_statut";');
  },
};
