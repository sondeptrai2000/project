const AccountModel = require('../models/account');
const ClassModel = require('../models/class');
const { JsonWebTokenError } = require('jsonwebtoken');
var jwt = require('jsonwebtoken');
class teacherController {
    teacherHome(req, res) {
        res.render('teacher/teacherHome')
    }

    teacherProfile(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.findOne({ _id: decodeAccount })
            .then(data => {
                res.render('teacher/teacherProfile', { data })
            })
    }

    allClass(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        ClassModel.find({ teacherID: decodeAccount }).populate('studentID').populate('teacherID').exec((err, classInfor) => {
            res.render('teacher/allClass', { classInfor })
        })
    }

    allClassStudent(req, res) {
        var _id = req.query.abc
        ClassModel.find({ _id: _id }).populate('studentID').populate('teacherID').exec((err, selectedClassInfor) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: selectedClassInfor });
            }
        })
    }

    viewClass(req, res) {
        res.json('Trang thông tin lớp học')
    }

    takeAttended(req, res) {
        res.json('Trang điểm danh')
    }


    editClass(req, res) {
        res.json('Trang trỉnh sủa thông tin các lớp học')
    }

    addStudentToClass(req, res) {
        res.json('Trang thêm học sinh vào lớp ')
    }

    studentAssessment(req, res) {
        res.json('Trang đánh giá học sinh trong lớp ')
    }

    allextracurricularActivities(req, res) {
        res.json('Trang xem tất cả các hoạt động ngoại khóa mà giáo viên đã thực hiện (góc nhìn: giáo viên)')
    }

    extracurricularActivities(req, res) {
        res.json('Trang xem thông tin hoạt động ngoại khóa đã thực hiện và tiến hành đánh giá học sinh trong hoạt động ngoại khóa ')
    }

    proposeEtracurricularActivities(req, res) {
        res.json('Gửi thông tin và bản kế hoạch về hoạt động ngoại khóa')
    }

    allChat(req, res) {
        res.json('Tất cả những cuộc trò chuyện')
    }

    connectToChat(req, res) {
        res.json('chọn người để trò chuyện')
    }

    chatConversation(req, res) {
        res.json('Thực hiện cuộc trò chuyện')
    }


}
module.exports = new teacherController