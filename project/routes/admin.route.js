var express = require('express');
var adminRouter = express.Router();
var adminController = require('../controller/admin.controller')


adminRouter.get('/', adminController.adminHome)
adminRouter.get('/getAccount', adminController.getAccount)


adminRouter.get('/getStage', adminController.getStage)
adminRouter.get('/getStudent', adminController.getStudent)
adminRouter.get('/getRoute', adminController.getRoute)

//assignRoomAndTime
adminRouter.get('/assignRoomAndTime', adminController.assignRoomAndTime)
adminRouter.post('/addRoom', adminController.addRoom)
adminRouter.get('/getThu', adminController.getThu)

adminRouter.post('/doupdateSchedule', adminController.doupdateSchedule)



//tạo tài khoản
adminRouter.get('/createAccount', adminController.createAccount)
adminRouter.post('/doCreateAccount', adminController.doCreateAccount)
    //update account
adminRouter.get('/editAccount', adminController.editAccount)
adminRouter.post('/doeditAccount', adminController.doeditAccount)

//liên quan đến lộ trình học
adminRouter.get('/createRoute', adminController.createRoute)
adminRouter.get('/lol', adminController.lol)
adminRouter.post('/docreateRoute', adminController.docreateRoute)
adminRouter.delete('/deleteRoute', adminController.deleteRoute)

//liên quan đến lớp học
adminRouter.get('/createClass', adminController.createClass)
adminRouter.post('/createClass', adminController.docreateClass)

adminRouter.get('/getClass', adminController.getClass)


adminRouter.get('/allClassLevel', adminController.allClassLevel)
adminRouter.get('/allClassStudent', adminController.allClassStudent)

adminRouter.get('/editClass', adminController.editClass)
adminRouter.get('/addStudentToClass', adminController.addStudentToClass)
adminRouter.get('/addTeacherToClass', adminController.addTeacherToClass)

//liên quan đến hoạt động ngoại khóa
adminRouter.get('/allProposal', adminController.allProposal)
adminRouter.post('/rateProppsal', adminController.rateProppsal)

//liên quan đến dashboard
adminRouter.get('/dashboard', adminController.dashboard)


// tạo sự kiện (noel,etc)
adminRouter.post('/createEvent', adminController.createEvent)
adminRouter.get('/allEvent', adminController.allEvent)
adminRouter.delete('/deleteEvent', adminController.deleteEvent)
adminRouter.post('/doUpdateEvent', adminController.doUpdateEvent)

adminRouter.get('/allEventProposal', adminController.allEventProposal)
adminRouter.post('/dorateEventProposal', adminController.dorateEventProposal)

//Thông tin tư vấn
adminRouter.get('/consultingAll', adminController.consultingAll)


module.exports = adminRouter