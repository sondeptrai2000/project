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
        AccountModel.find({ _id: decodeAccount }).populate('classID').lean().exec((err, data) => {
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
        AccountModel.find({ _id: decodeAccount._id }).populate({
            path: 'classID',
            populate: {
                path: 'teacherID',
                select: 'username',
            }
        }).lean().exec((err, data) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json(data);

                // res.render('student/allClass', { data });
            }
        })
    }

    getTeacherProfile(req, res) {
        AccountModel.find({ _id: req.query.abc }, { username: 1, email: 1, avatar: 1 }).lean().exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    allClassStudent(req, res) {
        var _id = req.query.abc
        ClassModel.find({ _id: _id }).populate('studentID.ID', { username: 1, email: 1, avatar: 1 }).lean().exec((err, selectedClassInfor) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: selectedClassInfor });
            }
        })
    }

    learningProgress(req, res) {
        res.json('Trang thông tin tiến độ học tập của con')
    }

    viewschedule(req, res) {
        res.render('student/schedule')
    }


    getSchedule(req, res) {
        var token = req.cookies.token
        var decodeAccount = jwt.verify(token, 'minhson')
        var studentID = decodeAccount._id
            //lấy thời hiện tại để lấy khóa học đang hoạt động trong thời gian hiện tại. 
        var sosanh = new Date()
        AccountModel.findOne({ _id: decodeAccount }, { classID: 1 }).lean().exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                ClassModel.find({ _id: { $in: data.classID }, startDate: { $lte: sosanh }, endDate: { $gte: sosanh } }).lean().exec((err, classInfor) => {
                    if (err) {
                        res.json({ msg: 'error' });
                    } else {
                        res.json({ msg: 'success', classInfor, studentID });
                    }
                })
            }
        })

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