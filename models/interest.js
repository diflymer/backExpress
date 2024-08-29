const { sequelize, Sequelize } = require('./index');
const { DataTypes } = Sequelize;

const Interest = sequelize.define('Interest', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: false,
});

module.exports = Interest;