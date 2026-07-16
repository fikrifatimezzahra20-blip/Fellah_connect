'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('Users', [
      {
        fullName: 'Admin Manager',
        email: 'admin@fellahconnect.ma',
        password: 'hashedpassword123',
        role: 'ADMIN',
        createdAt: now,
        updatedAt: now
      },
      {
        fullName: 'Hassan El Agriculteur',
        email: 'hassan@fellahconnect.ma',
        password: 'hashedpassword123',
        role: 'FARMER',
        createdAt: now,
        updatedAt: now
      },
      {
        fullName: 'Brahim Le Releveur',
        email: 'brahim@fellahconnect.ma',
        password: 'hashedpassword123',
        role: 'RELEVEUR',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
