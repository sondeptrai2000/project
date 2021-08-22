const AccountModel = require('../models/account');
const ClassModel = require('../models/class');
const assignRoomAndTimeModel = require('../models/assignRoomAndTime');
const studyRouteModel = require('../models/studyRoute');
const nodemailer = require('nodemailer');

const { JsonWebTokenError } = require('jsonwebtoken');
var jwt = require('jsonwebtoken');
const fs = require("fs")
const readline = require("readline")
const { google } = require("googleapis")
var path = require('path');

// set up mail sever
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'fptedunotification@gmail.com',
        pass: 'son@1234'
    },
    tls: {
        rejectUnauthorized: false
    }
});


class teacherController {
    teacherHome(req, res) {
        res.render('teacher/teacherHome')
    }

    teacherProfile(req, res) {
        var token = req.cookies.token
        var decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.findOne({ _id: decodeAccount }).lean().exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    allClass(req, res) {
        var token = req.cookies.token
        var decodeAccount = jwt.verify(token, 'minhson')
        ClassModel.find({ teacherID: decodeAccount }, { StudentIDoutdoor: 0 }).lean().exec((err, classInfor) => {
            res.render('teacher/allClass', { classInfor })
        })
    }

    schedule(req, res) {
        res.render('teacher/schedule')
    }

    getSchedule(req, res) {
        var token = req.cookies.token
        var decodeAccount = jwt.verify(token, 'minhson')
            //lấy thời điểm đầu tuần để lấy khóa học đang hoạt động trong khoảng thời gian đó. 
        var sosanh = new Date(req.query.dauTuan)
        ClassModel.find({ teacherID: decodeAccount, startDate: { $lte: sosanh }, endDate: { $gte: sosanh } }).lean().exec((err, classInfor) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', classInfor });
            }
        })
    }



    attendedList(req, res) {
        ClassModel.find({ _id: req.query.id }, { schedule: 1 }).lean().exec((err, data) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    attendedListStudent(req, res) {
        console.log(req.query.idattend)
        console.log(req.query.idClass)
        ClassModel.find({ _id: req.query.idClass }, { schedule: { $elemMatch: { _id: req.query.idattend } } }).populate({ path: "schedule.attend.studentID", select: "username avatar" }).lean().exec((err, data) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    doTakeAttended(req, res) {
        var now = new Date()
        var theLastCourse = new Date(req.body.lastDate.split("T00:00:00.000Z")[0])
        ClassModel.updateOne({ _id: req.body.idClass, "schedule._id": req.body.schedule }, {
            $set: {
                "schedule.$.attend": req.body.attend
            }
        }).lean().exec((err, data) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                if (req.body.scheduleStatus == 'update') {
                    assignRoomAndTimeModel.updateOne({ dayOfWeek: req.body.scheduleDay, room: { $elemMatch: { room: req.body.scheduleRoom, time: req.body.scheduleTime } } }, {
                        $set: { "room.$.status": "None" }
                    }, function(err, data) {
                        if (err) {
                            console.log("err")
                            res.json({ msg: 'error' });
                        }
                    })
                }

                if (now >= theLastCourse) {
                    for (var i = 0; i < req.body.time.length; i++) {
                        console.log(req.body.day[i])
                        assignRoomAndTimeModel.updateOne({ dayOfWeek: req.body.day[i], room: { $elemMatch: { room: req.body.room[i], time: req.body.time[i] } } }, {
                            $set: { "room.$.status": "None" }
                        }, function(err, data) {
                            if (err) {
                                console.log("err")
                                res.json({ msg: 'error' });
                            }
                        })
                    }
                    ClassModel.updateOne({ _id: req.body.idClass }, { classStatus: 'Finished' }, function(err, data) {
                        if (err) {
                            res.json({ msg: 'error' });
                        } else {
                            res.json({ msg: 'success' });
                        }
                    })
                } else {
                    res.json({ msg: 'success' });
                }
            }
        })
    }



    allClassStudent(req, res) {
        var _id = req.query.abc
        ClassModel.find({ _id: _id }).populate('studentID.ID', { avatar: 1, username: 1, aim: 1, email: 1 }).lean().exec((err, selectedClassInfor) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: selectedClassInfor });
            }
        })
    }

    addStudentToClass(req, res) {
        var condition = req.query.condition
        AccountModel.find(condition, { avatar: 1, username: 1, subject: 1, routeName: 1, stage: 1, email: 1, classID: 1 }).lean().exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    async doaddStudentToClass(req, res) {
        try {
            await AccountModel.updateMany({ _id: { $in: req.body.studentlistcl } }, { $push: { classID: req.body.classID, subject: req.body.subject } })
            await ClassModel.findOneAndUpdate({ _id: req.body.classID }, {
                $push: {
                    studentID: {
                        $each: req.body.studentlist
                    },
                    StudentIDoutdoor: {
                        $each: req.body.studentlist
                    }
                }
            })
            res.json({ msg: 'success' });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }

    async doremoveStudentToClass(req, res) {
        try {
            await AccountModel.updateMany({ _id: { $in: req.body.studentlistcl } }, { $pull: { classID: req.body.classID, subject: req.body.subject } })
            await ClassModel.updateMany({ _id: req.body.classID }, {
                $pull: {
                    studentID: {
                        ID: { $in: req.body.studentlistcl }
                    },
                    StudentIDoutdoor: {
                        ID: { $in: req.body.studentlistcl }
                    }
                }
            })
            res.json({ msg: 'success' });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }

    async studentAssessment(req, res) {
        try {
            //cập nhật điểm, đánh giá của giáo viên về học sinh trong lớp
            var classInfor = await ClassModel.findOneAndUpdate({ _id: req.body.classID, 'studentID.ID': req.body.studentId }, {
                $set: {
                    "studentID.$.grade": req.body.grade,
                    "studentID.$.feedBackContent": req.body.comment
                }
            })
            if (req.body.grade != "Restudy") {
                //cập nhật thông tin về tiến độ của học sinh trong bảng thông tin cá nhân
                var status = "Pass"
                await AccountModel.updateOne({ _id: req.body.studentId }, {
                        "$set": { "progess.$[progess].stageClass.$[stageClass].status": status }
                    }, { "arrayFilters": [{ "progess.stage": classInfor.stage }, { "stageClass.classID": req.body.classID }] })
                    //lấy tiến độ học tập của học sinh từ bảng thông tin cá nhân
                var studentProgress
                var progess = await AccountModel.findOne({ _id: req.body.studentId }, { progess: 1, aim: 1, email: 1, username: 1 })
                    //lấy số lượng pass các khóa học để so sánh với số lượng class trong giai đoạn. == thì đã hoàn thành hết các lớp trong giai đoạn đó và sẽ tiến hành chuyển tiépe giai đoạn 
                var Passed = 0
                progess.progess.forEach((e, index) => {
                        if (e.stage == classInfor.stage) {
                            studentProgress = e.stageClass
                            e.stageClass.forEach((check, index) => {
                                if (check.status == "Pass") {
                                    Passed++
                                }
                            })
                        }
                    })
                    //lấy lộ trình mà học sinh đang theo học để xem xét chuyển giai đoạn
                var route = await studyRouteModel.findOne({ routeName: classInfor.routeName }, { routeSchedual: 1 })
                var indexOfNextClass
                var routeClass
                route.routeSchedual.forEach((e, index) => {
                        if (e.stage == classInfor.stage) {
                            routeClass = e.routeabcd
                            indexOfNextClass = index + 1
                        }
                    })
                    //check xem học sinh đã hoàn thành các lớp của giai đoạn hiện tại chưa
                if (Passed == routeClass.length + 1) {
                    //kiểm tra xem lộ trình học của học sinh đã kết thúc chưa. Check theo aim mà học sinh đã đăng ký.
                    if (classInfor.stage == progess.aim) {
                        var content = progess.username + " đã hoàn thành khóa học đăng ký: Lộ trình: " + classInfor.routeName + ".  Giai đoạn: " + progess.aim + ". Vui lòng đến trung tâm để xác thực và trao chứng chỉ."
                        var mainOptions = {
                            from: 'fptedunotification@gmail.com',
                            to: progess.email,
                            subject: 'Notification',
                            text: content
                        }
                        await transporter.sendMail(mainOptions)
                        res.json({ msg: 'success' });
                    } else {
                        // chuyển giai đoạn tiếp theo
                        var nextStage = route.routeSchedual[indexOfNextClass].stage
                        await AccountModel.findOneAndUpdate({ _id: req.body.studentId }, { $push: { progess: { stage: nextStage, stageClass: [] } } })
                        await AccountModel.findOneAndUpdate({ _id: req.body.studentId }, { stage: nextStage })
                        res.json({ msg: 'success' });
                    }
                } else {
                    res.json({ msg: 'success' });
                }
            } else {
                //cập nhật thông tin về tiến độ của học sinh trong bảng thông tin cá nhân nếu học sinh fail 
                var status = "Fail"
                await AccountModel.updateOne({ _id: req.body.studentId }, {
                    "$set": { "progess.$[progess].stageClass.$[stageClass].status": status }
                }, { "arrayFilters": [{ "progess.stage": classInfor.stage }, { "stageClass.classID": req.body.classID }] })
                res.json({ msg: 'success' });
            }
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }
}
module.exports = new teacherController