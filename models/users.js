const { sequelize, Sequelize } = require('./index');
const { DataTypes } = Sequelize; // Извлечение DataTypes из Sequelize
var bcrypt = require('bcrypt')

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: true
  }
  // email: {
  //   type: DataTypes.STRING,
  //   allowNull: false
  // },

  // tg: {
  //   type: DataTypes.STRING,
  //   allowNull: true
  // }
}, {
  // Опции модели
  timestamps: false, // Добавление полей createdAt и updatedAt
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    },
  },
});

User.prototype.validPassword = async function(password) {
  console.log('Старт валидации пароля ' + password + ' и ' + this.password)
  try {
    const isValid = await bcrypt.compare(password, this.password);
    console.log('Конец валидации пароля');
    return isValid;
  } catch (error) {
    console.error('Ошибка при валидации пароля:', error);
    return false;
  }
};

module.exports = User;