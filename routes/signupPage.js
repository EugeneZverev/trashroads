var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Sign up on Trashroads' });
});

module.exports = router;