// models/index.js
const { Sequelize } = require('sequelize');
const path = require('path');

// Создание экземпляра Sequelize и подключение к базе данных SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../database/mydatabase.db'), // Путь к файлу базы данных
});

// Экспорт объекта sequelize и класса Sequelize
module.exports = { sequelize, Sequelize };