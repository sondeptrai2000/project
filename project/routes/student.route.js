var express = require('express');
var studentRouter = express.Router();
var studentController = require('../controller/student.controller')



studentRouter.get('/', studentController.studentHome)

//liên quan đến  tài khoản
studentRouter.get('/studentProfile', studentController.studentProfile)
studentRouter.get('/getTeacherProfile', studentController.getTeacherProfile)

//liên quan đến lớp học
studentRouter.get('/allClass', studentController.allClass)
studentRouter.get('/learningProgress', studentController.learningProgress)
studentRouter.get('/viewschedule', studentController.viewschedule)



//liên quan đến hoạt động ngoại khóa
studentRouter.get('/allextracurricularActivities', studentController.allextracurricularActivities)

//chat
studentRouter.get('/allChat', studentController.allChat)
studentRouter.get('/connectToChat', studentController.connectToChat)
studentRouter.get('/chatConversation', studentController.chatConversation)


module.exports = studentRouter