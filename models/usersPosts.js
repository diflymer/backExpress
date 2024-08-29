const { sequelize, Sequelize } = require('./index');
const { DataTypes } = Sequelize;

const UsersPosts = sequelize.define('users_posts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
    }
  }, {
    indexes: [
      {
        unique: false, // Убираем уникальное ограничение
        fields: ['userId', 'postId']
      }
    ]
  });

module.exports = UsersPosts;