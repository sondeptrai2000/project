var express = require('express');
var adminRouter = express.Router();
var adminController = require('../controller/admin.controller')
adminRouter.get('/', adminController.adminHome)

//Manage account page
adminRouter.get('/createAccount', adminController.createAccount);

adminRouter.get('/getAccount', adminController.getAccount);
adminRouter.get('/countAccount', adminController.countAccount);
adminRouter.get('/search', adminController.search);
adminRouter.get('/getStage', adminController.getStage);
adminRouter.get('/getRoute', adminController.getRoute);
adminRouter.get('/editAccount', adminController.editAccount);
adminRouter.post('/doCreateAccount', adminController.doCreateAccount);
adminRouter.post('/doeditAccount', adminController.doeditAccount);

//Manage class page
// adminRouter.get('/allClassLevel', adminController.allClassLevel);
adminRouter.get('/getTeacherAndClass', adminController.getTeacherAndClass);

adminRouter.get('/countClass', adminController.countClass);

adminRouter.get('/searchClass', adminController.searchClass);
adminRouter.get('/getAllClass', adminController.getAllClass);
adminRouter.get('/attendedList', adminController.attendedList);
adminRouter.get('/getThu', adminController.getThu);
adminRouter.post('/doupdateSchedule', adminController.doupdateSchedule);
adminRouter.get('/deleteClass', adminController.deleteClass);
adminRouter.get('/allClassStudent', adminController.allClassStudent);
adminRouter.get('/addStudentToClass', adminController.addStudentToClass);
adminRouter.post('/doaddStudentToClass', adminController.doaddStudentToClass);
adminRouter.post('/doremoveStudentToClass', adminController.doremoveStudentToClass);
adminRouter.get('/getTime', adminController.getTime);
adminRouter.get('/createClass', adminController.createClass);
adminRouter.post('/createClass', adminController.docreateClass);
adminRouter.get('/getStudent', adminController.getStudent);

//Manage Route page
adminRouter.get('/createRoute', adminController.createRoute);

adminRouter.get('/getAllRoute', adminController.getAllRoute);
adminRouter.get('/viewSchedule', adminController.viewSchedule);
adminRouter.get('/searchRoute', adminController.searchRoute);
adminRouter.post('/docreateRoute', adminController.docreateRoute);
adminRouter.post('/doUpdateRoute', adminController.doUpdateRoute);
adminRouter.delete('/deleteRoute', adminController.deleteRoute);

//xem các lớp mà học sinh đã học (studentClassDetail)
adminRouter.get('/studentClass/:id', adminController.studentClass);

//Manage room and time
adminRouter.get('/assignRoomAndTime', adminController.assignRoomAndTime);
adminRouter.post('/addRoom', adminController.addRoom);

//Thông tin tư vấn
adminRouter.get('/consultingAll', adminController.consultingAll);


module.exports = adminRouter