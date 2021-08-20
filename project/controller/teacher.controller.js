const AccountModel = require('../models/account');
const ClassModel = require('../models/class');
const assignRoomAndTimeModel = require('../models/assignRoomAndTime');

const { JsonWebTokenError } = require('jsonwebtoken');
var jwt = require('jsonwebtoken');
const fs = require("fs")
const readline = require("readline")
const { google } = require("googleapis")
var path = require('path');

//setup kết nối tới ggdrive
const KEYFILEPATH = path.join(__dirname, 'service_account.json')
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth(
    opts = {
        keyFile: KEYFILEPATH,
        scopes: SCOPES
    }
);
const driveService = google.drive(options = { version: 'v3', auth });

function dateNow() {
    var date = new Date()
    var month = date.getMonth() + 1
    var lol = date.getFullYear() + "-" + month + "-" + date.getDate()
    return lol
}

async function uploadFile(name, rootID, path) {
    var id = []
    id.push(rootID)
    var responese = await driveService.files.create(param = {
        resource: {
            "name": name,
            "parents": id
        },
        media: {
            body: fs.createReadStream(path = path)
        },
    })
    await driveService.permissions.create({
        fileId: responese.data.id,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        },
    });
    return responese.data.id
}

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

    studentAssessment(req, res) {
        ClassModel.findOneAndUpdate({ _id: req.body.classID, 'studentID.ID': req.body.studentId }, {
            $set: {
                "studentID.$.grade": req.body.grade,
                "studentID.$.feedBackContent": req.body.comment
            }
        }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
            }
        })
    }

}
module.exports = new teacherController