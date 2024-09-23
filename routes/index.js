var express = require('express');
var router = express.Router();
const User = require('../models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send("GOT IT OK");
});

module.exports = router;
