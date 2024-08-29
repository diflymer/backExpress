var express = require('express');
var router = express.Router();
const Interest = require('../models/interest');

router.get('/getAllInterests', async (req, res, next) => {
    const interests = await Interest.findAll();
    res.json(interests)
})

module.exports = router;