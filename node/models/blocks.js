'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  blocks.init({
    sender_public_key: DataTypes.STRING,
    recipient_public_key: DataTypes.STRING,
    time: DataTypes.STRING,
    block_num: DataTypes.INTEGER,
    glimp: DataTypes.STRING,
    prev_hash: DataTypes.STRING,
    miner: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'blocks',
  });
  return blocks;
};