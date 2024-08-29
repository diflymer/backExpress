var express = require('express');
var router = express.Router();
const User = require('../models/users');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (err) {
    console.error('Ошибка получения пользователей:', err);
    res.send("Ошибка ")
  }
});

module.exports = router;
