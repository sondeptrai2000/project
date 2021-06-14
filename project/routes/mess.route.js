var express = require('express');
const ClassModel = require('../models/class');
var messRoute = express.Router();
const messController = require('../controller/mess.controller');
messRoute.get('/makeConnection', messController.makeConnection)
messRoute.get('/chatBox', messController.chatBox)


module.exports = messRoute