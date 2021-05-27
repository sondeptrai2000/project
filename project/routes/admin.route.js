var express = require('express');
var adminRouter = express.Router();
var adminController = require('../controller/admin.controller')


adminRouter.get('/', adminController.adminHome)
adminRouter.get('/allTeacher', adminController.allTeacher)
adminRouter.get('/allStudent', adminController.allStudent)
adminRouter.get('/allGuardian', adminController.allGuardian)

//tạo tài khoản
adminRouter.get('/createAccount', adminController.createAccount)
adminRouter.post('/doCreateAccount', adminController.doCreateAccount)
    //update account
adminRouter.get('/editAccount', adminController.editAccount)
adminRouter.post('/editAccount', adminController.doeditAccount)


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