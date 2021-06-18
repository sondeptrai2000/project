var express = require('express');
const ClassModel = require('../models/class');
var messRoute = express.Router();
const messController = require('../controller/mess.controller');
messRoute.post('/makeConnection', messController.makeConnection)
messRoute.get('/getMessenger', messController.getMessenger)
messRoute.get('/chatForm', messController.chatForm)


module.exports = messRoute