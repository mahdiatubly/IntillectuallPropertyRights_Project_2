'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sender_public_key: {
        type: Sequelize.STRING
      },
      recipient_public_key: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.STRING
      },
      block_num: {
        type: Sequelize.INTEGER
      },
      glimp: {
        type: Sequelize.STRING
      },
      prev_hash: {
        type: Sequelize.STRING
      },
      miner: {
        type: Sequelize.STRING
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('blocks');
  }
};