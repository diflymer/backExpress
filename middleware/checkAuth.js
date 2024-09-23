const jwt = require('jsonwebtoken');

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// Мидлвер для проверки токена
const checkAuth = (req, res, next) => {

  try {
    
    console.log('checkAuth started')

    const token = req.headers['authorization'];

    console.log('token: ' + token)

    // Проверка наличия токена
    if (!token) {
      return res.sendStatus(401); // Отправляем статус 401, если токен отсутствует
    }
    
    // Проверка и декодирование токена
    jwt.verify(token, jwtSecret, (err, decoded) => {
      console.log('id при авторизации: ' + decoded?.id)
      if (err) {
        return res.sendStatus(403); // Если ошибка, возвращаем статус 403
      }
      req.id = decoded.id; // Сохраняем данные пользователя в запросе
      next(); // Переходим к следующему обработчику
    });

  } catch (err){
    console.log(err)
  }



};

module.exports = checkAuth;