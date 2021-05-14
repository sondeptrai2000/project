var express = require('express');
var teacherRouter = express.Router();
var teacherController = require('../controller/teacher.controller')



teacherRouter.get('/',teacherController.teacherHome)

//tạo tài khoản
teacherRouter.get('/teacherProfile',teacherController.teacherProfile)

//liên quan đến lớp học
teacherRouter.get('/allClass',teacherController.allClass)
teacherRouter.get('/viewClass',teacherController.viewClass)
teacherRouter.get('/takeAttended',teacherController.takeAttended)
teacherRouter.get('/addStudentToClass',teacherController.addStudentToClass)
teacherRouter.get('/studentAssessment',teacherController.studentAssessment)

//liên quan đến hoạt động ngoại khóa
teacherRouter.get('/proposeEtracurricularActivities',teacherController.proposeEtracurricularActivities)
teacherRouter.get('/allextracurricularActivities',teacherController.allextracurricularActivities)
teacherRouter.get('/extracurricularActivities',teacherController.extracurricularActivities)

//chat
teacherRouter.get('/allChat',teacherController.allChat)
teacherRouter.get('/connectToChat',teacherController.connectToChat)
teacherRouter.get('/chatConversation',teacherController.chatConversation)


module.exports = teacherRouter