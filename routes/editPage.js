var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('edit', { title: 'Add new data to map' });
});

module.exports = router;