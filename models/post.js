const { sequelize, Sequelize } = require('./index');
const { DataTypes } = Sequelize;

const Post = sequelize.define('Post', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  place: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  datetime_from: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  datetime_to: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  has_chat: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  max_people: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Post;