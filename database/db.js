const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'mydatabase.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка при подключении к базе данных:', err.message);
  } else {
    console.log('Соединение с базой данных установлено.');
  }
});

module.exports = db;

db.serialize(() => {
  // db.run(`CREATE TABLE IF NOT EXISTS users (
  //   id INTEGER PRIMARY KEY AUTOINCREMENT,
  //   name TEXT NOT NULL,
  //   email TEXT UNIQUE NOT NULL
  // )`, (err) => {
  //   if (err) {
  //     console.error('Ошибка при создании таблицы users:', err.message);
  //   } else {
  //     console.log('Таблица users успешно создана или уже существует.');
  //   }
  // });
  
});