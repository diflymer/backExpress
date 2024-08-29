const { sequelize, Sequelize } = require('./index');
const { DataTypes } = Sequelize;

const UsersInterests = sequelize.define('users_interests', {
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
    interestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Interests',
        key: 'id'
      }
    }
  }, {
    indexes: [
      {
        unique: false, // Убираем уникальное ограничение
        fields: ['userId', 'interestId']
      }
    ]
  });

module.exports = UsersInterests;