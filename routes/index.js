var express = require('express');
var router = express.Router();
const User = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send("GOT IT OK");
});

router.post('/add_user', async (req, res, next) => {
  const {name, email} = req.body;
  try {
    await User.create({ name, email });
    res.send("Пользователь добавлен");
  } catch (err) {
    console.error('Ошибка добавления пользователя:', err);
    res.status(500).send('Ошибка добавления пользователя');
  }
});

module.exports = router;
