var express = require('express');
var teacherRouter = express.Router();
var teacherController = require('../controller/teacher.controller')



teacherRouter.get('/', teacherController.teacherHome)

//tạo tài khoản
teacherRouter.get('/teacherProfile', teacherController.teacherProfile)

//liên quan đến lớp học
teacherRouter.get('/allClass', teacherController.allClass)
teacherRouter.get('/allClassStudent', teacherController.allClassStudent)


teacherRouter.get('/addStudentToClass', teacherController.addStudentToClass)
teacherRouter.post('/doaddStudentToClass', teacherController.doaddStudentToClass)
teacherRouter.post('/doremoveStudentToClass', teacherController.doremoveStudentToClass)
teacherRouter.post('/studentAssessment', teacherController.studentAssessment)

//liên quan đến hoạt động ngoại khóa
teacherRouter.post('/uploadNewProposal', teacherController.uploadNewProposal)
teacherRouter.get('/allProposal', teacherController.allProposal)
teacherRouter.delete('/deleteProposal', teacherController.deleteProposal)
teacherRouter.get('/extracurricularActivities', teacherController.extracurricularActivities)
teacherRouter.get('/allEvent', teacherController.allEvent)
teacherRouter.post('/updateProposalEvent', teacherController.updateProposalEvent)
teacherRouter.delete('/deleteProposalEvent', teacherController.deleteProposalEvent)

//chat
teacherRouter.get('/allChat', teacherController.allChat)
teacherRouter.get('/connectToChat', teacherController.connectToChat)
teacherRouter.get('/chatConversation', teacherController.chatConversation)


module.exports = teacherRouter