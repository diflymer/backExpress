const express = require('express');
const router = express.Router();
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// Регистрация
router.post('/register', async (req, res) => {

  const { name, username, password, about, interests } = req.body;
  try {

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким login уже существует' });
    }
    console.log(name + " " + username + ' ' + password + ' ' + about)
    const newUser = await User.create({ name, username, password, desc: about});
    console.log('User создан')
    newUser.setInterests(interests);
    console.log('Интересы установлены')

    const token = jwt.sign({ id: newUser.id }, jwtSecret, { expiresIn: '1h' });

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.log('Ошибка регистрации пользователя')
    res.status(500).json({ message: 'Ошибка регистрации пользователя', error });
  }
});

// Авторизация
router.post('/login', async (req, res) => {
  console.log('Логирование')
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.json({message: 'Неверный логин или пароль'});
    console.log('Пользователь: ' + user)

    const isValid = await user.validPassword(password)
    console.log('Конец isValid ' + isValid)
    if (!isValid) return res.json({message: 'Неверный логин или пароль'});

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
    console.log('Токен: ' + token)
    res.json({ token, user });
  } catch (error) {
    res.status(500);
  }
});

//Проверка токена
router.get('/auth/me', async (req, res, next) => {
    const token = req.headers['authorization'];

    if (token === 'undefined'){
      return res.sendStatus(204);
    }

    jwt.verify(token, jwtSecret, async (err, user) => {

        if (err) return res.sendStatus(204);

        try {
          const userFound = await User.findByPk(user.id);

          if (!userFound) {
            return res.status(204).json({ message: 'User not found' });
          }
          const userBack = await User.findOne( { where: {id: user.id} } );
          res.json({user: userBack});

        } catch (error) {
          return res.status(500);
        }

    });
})

module.exports = router;