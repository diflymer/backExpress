'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const interests = ['Sports', 'Music', 'Travel', 'Technology', 'Reading']
    interests.forEach( async (name)  => {
      let chat = await queryInterface.bulkInsert('Chats', [{type: 0}], { returning: ['id'] });
      await queryInterface.bulkInsert('Interests', [{ name, chatid: chat }]);
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Interests', null, {});
    await queryInterface.bulkDelete('Chats', {type: 0}, {});
  }
};
