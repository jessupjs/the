var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('vcg/nodes/index', { title: 'Visual Computing Group' });
});

module.exports = router;
