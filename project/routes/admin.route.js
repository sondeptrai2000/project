var express = require('express');
var adminRouter = express.Router();
var adminController = require('../controller/admin.controller')


adminRouter.get('/', adminController.adminHome)
adminRouter.get('/getAccount', adminController.getAccount)


adminRouter.get('/getStage', adminController.getStage)
adminRouter.get('/getRoute', adminController.getRoute)



//tạo tài khoản
adminRouter.get('/createAccount', adminController.createAccount)
adminRouter.post('/doCreateAccount', adminController.doCreateAccount)
    //update account
adminRouter.get('/editAccount', adminController.editAccount)
adminRouter.post('/doeditAccount', adminController.doeditAccount)

//liên quan đến lộ trình học
adminRouter.get('/createRoute', adminController.createRoute)
adminRouter.post('/docreateRoute', adminController.docreateRoute)

//liên quan đến lớp học
adminRouter.get('/createClass', adminController.createClass)
adminRouter.post('/createClass', adminController.docreateClass)


adminRouter.get('/allClassLevel', adminController.allClassLevel)
adminRouter.get('/allClassStudent', adminController.allClassStudent)

adminRouter.get('/editClass', adminController.editClass)
adminRouter.get('/addStudentToClass', adminController.addStudentToClass)
adminRouter.get('/addTeacherToClass', adminController.addTeacherToClass)

//liên quan đến hoạt động ngoại khóa
adminRouter.get('/allextracurricularActivities', adminController.allextracurricularActivities)
adminRouter.get('/extracurricularActivities', adminController.extracurricularActivities)


//liên quan đến dashboard
adminRouter.get('/dashboard', adminController.dashboard)




module.exports = adminRouter