const { sequelize, Sequelize } = require('./index');
const { DataTypes } = Sequelize;

const Chat = sequelize.define('Chat', {
  type: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
}, {
  timestamps: false,
});

module.exports = Chat;