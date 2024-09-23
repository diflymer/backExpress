'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // await queryInterface.addColumn('Messages', 'createdAt', {
    //   allowNull: true,
    //   type: Sequelize.DATE
    // });
    
    // await queryInterface.addColumn('Messages', 'updatedAt', {
    //   allowNull: true,
    //   type: Sequelize.DATE
    // });

    // Изменяем столбцы, чтобы установить дефолтные значения
    await queryInterface.changeColumn('Messages', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.changeColumn('Messages', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Messages', 'createdAt');
    await queryInterface.removeColumn('Messages', 'updatedAt');
  }
};
