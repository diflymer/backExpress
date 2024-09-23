const { sequelize, Sequelize } = require('./index');
const { DataTypes } = Sequelize;

const Message = sequelize.define('Message', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = Message;