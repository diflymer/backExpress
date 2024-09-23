var express = require('express');
var router = express.Router();
const User = require('../models/users');

/* GET users listing. */
router.get('/getUserById', async function(req, res, next) {
  try {

    const user = await User.findByPk(req.query.id);

    //Интересы
    let interests = await user.getInterests({attributes: ['id', 'name'], joinTableAttributes: [] });

    res.json({
      id: user.id,
      name: user.name,
      desc: user.desc,
      interests
    });
  } catch (err) {
    console.error('Ошибка получения пользователя:', err);
    res.send("Ошибка")
  }
});

module.exports = router;
