var express = require('express');
var accounRouter = express.Router();
// var accountController = require('../controller/account.controller')
const { checkLogin } = require('../middleware/index');
const { homeAdmin, homeGuardian, homeStudent, homeTeacher, loginController } = require('../controller/account.controller');
accounRouter.post('/dologin', checkLogin, loginController)
accounRouter.get('/homeAdmin', homeAdmin)
accounRouter.get('/homeGuardian', homeGuardian)
accounRouter.get('/homeStudent', homeStudent)
accounRouter.get('/homeTeacher', homeTeacher)
module.exports = accounRouter