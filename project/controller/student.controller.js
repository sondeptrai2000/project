const { JsonWebTokenError } = require('jsonwebtoken');
const AccountModel = require('../models/account');
const ClassModel = require('../models/class');
var jwt = require('jsonwebtoken');

class studentController {
    studentHome(req, res) {
        res.json('Trang chủ student')
    }

    studentProfile(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.find({ _id: decodeAccount }).populate('classID').exec((err, data) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.render("student/studentProfile", { data: data });
            }
        })
    }

    getTeacherProfile(req, res) {
        AccountModel.find({ _id: req.query.abc }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    allClass(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.find({ _id: decodeAccount }).populate({
            path: 'classID',
            populate: {
                path: 'teacherID'
            }
        }).exec((err, data) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.render('student/allClass', { data: data });
            }
        })
    }

    learningProgress(req, res) {
        res.json('Trang thông tin tiến độ học tập của con')
    }

    viewschedule(req, res) {
        res.json('Xem thời khóa biểu')
    }

    allextracurricularActivities(req, res) {
        res.json('Trang xem tất cả các hoạt động ngoại khóa mà con đã tham gia + đánh giá')
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
module.exports = new studentController