var express = require('express');
var indexRouter = express.Router();
var indexController = require('../controller/index.controller')
var bodyParser = require('body-parser');
indexRouter.use(bodyParser.urlencoded({extended: false}));


indexRouter.get('/',indexController.home)
indexRouter.get('/courseinformation',indexController.courseinformation)
indexRouter.get('/aboutus',indexController.aboutus)


module.exports = indexRouter