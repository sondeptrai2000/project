const { JsonWebTokenError } = require('jsonwebtoken');
const AccountModel = require('../models/account');
const eventModel = require('../models/event');
const studyRouteModel = require('../models/studyRoute');
const ClassModel = require('../models/class');
const consultingInformationModel = require('../models/consultingInformation');
const assignRoomAndTimeModel = require('../models/assignRoomAndTime');

const fs = require("fs")
const readline = require("readline")
const { google } = require("googleapis")
var path = require('path');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { data } = require('jquery');
const { inflate } = require('zlib');
const saltRounds = 10;
const nodemailer = require('nodemailer');


//set up kết nối tới ggdrive
const KEYFILEPATH = path.join(__dirname, 'service_account.json')
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth(
    opts = {
        keyFile: KEYFILEPATH,
        scopes: SCOPES
    }
);
const driveService = google.drive(options = { version: 'v3', auth });



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
class adminController {
    adminHome(req, res) {
        // AccountModel.updateMany({}, { $set: { classID: [], subject: [] } }, function(err, data) {
        //     if (err) {
        //         console.log("k ok")
        //     } else {
        //         console.log(" ok")
        //     }
        // })
        // assignRoomAndTimeModel.updateMany({}, {
        //     $set: { room: [] }
        // }, function(err, data) {
        //     if (err) {
        //         console.log("k ok 2")
        //     } else {
        //         console.log(" ok 2 ")
        //     }
        // })
        // ClassModel.findOne({ teacherID: "60e56f421a272228e44b46d0", classStatus: "Processing" }, { schedule: { $elemMatch: { day: "03" } } },
        //         function(err, data) {
        //             if (err) {
        //                 console.log("k ok")
        //             } else {
        //                 console.log(data.schedule[0].time)
        //                 res.json(data)
        //             }
        //         })
        // ClassModel.find({ _id: "611b5f3af902832da4f97ed0" }, { "studentID.ID": 1 }).populate({ path: 'studentID.ID', select: 'email' }).lean().exec(function(err, data) {
        //         res.json(data[0].studentID)
        //         var listEmail = ""
        //         data[0].studentID.forEach(element => {
        //             listEmail = listEmail + element.ID.email + ', '
        //         })
        //         console.log(listEmail.slice(0, -2))
        //     })
        res.render('admin/adminHome')
    }

    assignRoomAndTime(req, res) {
        assignRoomAndTimeModel.find({}, function(err, data) {
            if (err) {
                res.json("lõi")
            } else {
                res.render('admin/assignRoomAndTime', { data })
            }
        })
    }

    addRoom(req, res) {
        assignRoomAndTimeModel.updateMany({}, {
            $push: { room: { $each: req.body.roomName } }
        }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success' });
            }
        })
    }

    async deleteClass(req, res) {
        var classInfor = await ClassModel.find({ _id: req.query.id })
        if (!classInfor) res.json({ msg: 'error' });
        var listStudentID = []
        classInfor[0].studentID.forEach((e) => {
            listStudentID.push(e.ID)
        })
        var deleteClass = await ClassModel.remove({ _id: req.query.id })
        if (!deleteClass) res.json({ msg: 'error' });

        var updateAccount = await AccountModel.updateMany({ _id: { $in: listStudentID } }, { $pull: { classID: req.query.id, subject: classInfor[0].subject } })
        if (!updateAccount) res.json({ msg: 'error' });
        res.json({ msg: 'success', data });

    }

    getThu(req, res) {
        var dayOfWeek = '0' + req.query.dayOfWeek
        assignRoomAndTimeModel.find({ dayOfWeek }, function(err, data) {
            if (err) {
                res.json("lõi")
            } else {
                res.json({ msg: 'success', data });
            }
        })
    }

    getTime(req, res) {
        ClassModel.find({ teacherID: req.query.teacherID, classStatus: "Processing" }, { schedule: { $elemMatch: { day: '0' + req.query.dayOfWeek } } },
            function(err, data) {
                if (err) {
                    res.json({ msg: 'error' });
                } else {
                    res.json({ msg: 'success', data });
                }
            })
    }

    async doupdateSchedule(req, res) {
        var oldSchuedule = req.body.old
        try {
            await ClassModel.updateOne({ _id: req.body.classID, "schedule._id": req.body.scheduleID }, {
                $set: {
                    "schedule.$.time": req.body.time,
                    "schedule.$.room": req.body.room,
                    "schedule.$.date": new Date(req.body.date),
                    "schedule.$.day": req.body.day,
                    "schedule.$.status": "update"
                }
            })
            await assignRoomAndTimeModel.updateOne({ dayOfWeek: req.body.day, room: { $elemMatch: { room: req.body.room, time: req.body.time } } }, {
                $set: { "room.$.status": "Ok" }
            })
            var getListEmail = await ClassModel.find({ _id: req.body.classID }, { "studentID.ID": 1, className: 1 }).populate({ path: 'studentID.ID', select: 'email' }).lean()
            var listEmail = ""
            getListEmail[0].studentID.forEach(element => {
                listEmail = listEmail + element.ID.email + ', '
            })
            listEmail.slice(0, -2)
            var content = 'Do 1 số vấn đề giáo viên, buổi học của lớp ' + getListEmail[0].className + ' vào ngày ' + oldSchuedule[0] + ' từ ' + oldSchuedule[3] + " chuyển sang ngày " + req.body.date + ' từ ' + req.body.time + '.';
            var mainOptions = {
                from: 'fptedunotification@gmail.com',
                to: listEmail,
                subject: 'Notification',
                text: content
            }
            transporter.sendMail(mainOptions, function(err, info) {
                if (err) {
                    res.json({ msg: 'error' });
                } else {
                    res.json({ msg: 'success' });
                }
            });
        } catch (e) {    
            if (e) {
                res.json({ msg: 'error' })
            }
        }
    }

    getAccount(req, res) {
        AccountModel.find({ role: req.query.role }).lean().countDocuments(function(err, numberOfAccount) {
            var skip = parseInt(req.query.sotrang) * 3
            var soTrang = numberOfAccount / 3 + 1
            AccountModel.find({ role: req.query.role }).populate("relationship", { username: 1, email: 1, phone: 1 }).skip(skip).limit(3).lean().exec((err, data) => {
                if (err) {
                    res.json({ msg: 'error' });
                } else {
                    res.json({ msg: 'success', data, numberOfAccount, soTrang });
                }
            })
        })
    }


    search(req, res) {
        var condition = req.query.condition
        AccountModel.findOne(condition).populate("relationship").populate({
            path: 'classID',
            match: { classStatus: "Processing" },
            populate: {
                path: 'teacherID',
                select: { username: 1, phone: 1, email: 1 }
            }
        }).lean().exec((err, data) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
            }
        })
    }

    async createAccount(req, res) {
        try {
            var numberOfAccount = await AccountModel.find({ role: "teacher" }).lean().countDocuments()
            var targetxxx = await studyRouteModel.find({}).lean()
            var data = await AccountModel.find({ role: "teacher" }).lean()
            res.render('admin/createAccount', { data, targetxxx, numberOfAccount })
        } catch (e) {
            if (e) {
                res.json({ msg: 'error' })
            }
        }
    }

    async getRoute(req, res) {
        try {
            var data = await studyRouteModel.find({}).lean()
            res.json({ msg: 'success', data });
        } catch (e) {
            if (e) {
                res.json({ msg: 'error' })
            }
        }
    }

    async getStage(req, res) {
        try {
            var targetxxx = await studyRouteModel.find({ routeName: req.query.abc }).lean()
            var student = await AccountModel.find({ role: 'student', routeName: req.query.abc, stage: req.query.levelS }).lean()
            var data = await studyRouteModel.find({ routeName: req.query.abc }).lean()
            res.json({ msg: 'success', data, student, targetxxx });
        } catch (e) {
            if (e) {
                res.json({ msg: 'error' })
            }
        }
    }

    getStudent(req, res) {
        AccountModel.find({ role: 'student', routeName: req.query.abc, stage: req.query.levelS }).lean().exec(function(err, student) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', student });
            }
        })
    }
    createRoute(req, res) {
        studyRouteModel.find({}, { _id: 1, routeName: 1, description: 1 }).lean().exec(function(err, data) {
            res.render('admin/createRoute', { data: data })
        })
    }

    lol(req, res) {
        studyRouteModel.find({ _id: req.query._id }).lean().exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
            }
        })
    }

    async docreateRoute(req, res) {
        try {
            var stageContent = req.body.stageContent
            var stageMoney = req.body.stageMoney
            var route = req.body.route
            var totalStage = req.body.totalStage
            var testthu = route.toString();
            testthu = testthu.split(",space,")
            var routeCreated = await studyRouteModel.create({
                routeName: req.body.routeName,
                description: req.body.description,
            })

            for (var i = 0; i < totalStage; i++) {
                testthu[i] = testthu[i].toString();
                testthu[i] = testthu[i].split(",")
                await studyRouteModel.updateOne({ _id: routeCreated._id }, {
                    $push: {
                        routeSchedual: {
                            stage: stageContent[i],
                            price: stageMoney[i],
                            routeabcd: testthu[i],
                        }
                    }
                })
            }
            res.json({ msg: 'success' })
        } catch (e) {
            if (e) {
                res.json({ msg: 'error' })
            }
        }
    }


    deleteRoute(req, res) {
        studyRouteModel.deleteOne({ _id: req.body.id }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success' });
            }
        })
    }


    async doCreateAccount(req, res) {
        try {
            var check = await AccountModel.find({ email: req.body.student.email }).lean()
            var check1 = await AccountModel.find({ email: req.body.phuhuynh.email }).lean()
            var checkphone = await AccountModel.find({ phone: req.body.student.phone }).lean()
            var checkphone1 = await AccountModel.find({ phone: req.body.phuhuynh.phone }).lean()
            if (check.length != 0 || check1.length != 0) {
                res.json({ msg: 'Account already exists' })
            } else if (checkphone.length != 0 || checkphone1.length != 0) {
                res.json({ msg: 'Phone already exists' })
            } else {
                var path = __dirname.replace("controller", "public/avatar") + '/' + req.body.filename;
                var image = req.body.file;
                var data = image.split(',')[1];
                fs.writeFileSync(path, data, { encoding: 'base64' });
                var response = await uploadFile(req.body.filename, "11B3Y7b7OJcbuqlaHPJKrsR2ow3ooKJv1", path)
                var fileLink = "https://drive.google.com/uc?export=view&id=" + response
                var student = req.body.student
                var phuhuynh = req.body.phuhuynh
                var role = student.role
                var password = req.body.password
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(password, salt);

                if (role === "teacher") {
                    student["avatar"] = fileLink
                    student["password"] = hash
                    await AccountModel.create(student)
                    res.json({ msg: 'success' });
                }
                if (role === "student") {
                    student["avatar"] = fileLink
                    student["password"] = hash
                    var studentAcc = await AccountModel.create(student)
                    phuhuynh["relationship"] = studentAcc._id
                    var guardianAcc = await AccountModel.create(phuhuynh)
                    var relationship = guardianAcc._id
                    var studentAcc = await AccountModel.findOneAndUpdate({ _id: studentAcc._id }, { relationship: relationship })
                    res.json({ msg: 'success' });
                }
            }
        } catch (e) {
            if (e) {
                console.log(e)
                res.json({ msg: 'error' });

            }
        }
    }

    editAccount(req, res) {
        studyRouteModel.find({}).lean().exec(function(err, targetxxx) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', targetxxx });
            }
        })
    }

    //làm cuối
    async doeditAccount(req, res) {
        try {
            var password = req.body.password
            var password1 = req.body.password + "phuhuynh"
            var formData1 = req.body.formData1
            var formData2 = req.body.formData2
            if (password.length != 0) {
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(password, salt);
                const salt1 = bcrypt.genSaltSync(saltRounds);
                const hash1 = bcrypt.hashSync(password1, salt);
                formData1["password"] = hash
                formData2["password"] = hash1
            }
            if (req.body.file != "none") {
                var path = __dirname.replace("controller", "public/avatar") + '/' + req.body.filename;
                var image = req.body.file;
                var data = image.split(',')[1];
                fs.writeFileSync(path, data, { encoding: 'base64' });
                var response = await uploadFile(req.body.filename, "11B3Y7b7OJcbuqlaHPJKrsR2ow3ooKJv1", path)
                if (!response) res.json({ msg: 'error' });
                update["avatar"] = "https://drive.google.com/uc?export=view&id=" + response
                var oldImg = req.body.oldLink
                oldImg = oldImg.split("https://drive.google.com/uc?export=view&id=")[1]
                await driveService.files.delete({ fileId: oldImg })
            } else {
                formData1["avatar"] = req.body.oldLink
            }
            if (formData1.role == "teacher") {
                await AccountModel.findOneAndUpdate({ _id: req.body.id }, formData1)
            } else {
                await AccountModel.findOneAndUpdate({ _id: req.body.id }, formData1)
                await AccountModel.findOneAndUpdate({ relationship: req.body.id }, formData2)
            }
            res.json({ msg: 'success', data: data });
        } catch (e) {
            if (e) {
                res.json({ msg: 'error' });
            }
        }
    }

    createClass(req, res) {
        ClassModel.find({}).lean().exec(function(err, ClassModel) {
            studyRouteModel.find({}).lean().exec(function(err, targetxxx) {
                AccountModel.find({ role: 'teacher' }).lean().exec(function(err, teacher) {
                    res.render('admin/createClass.ejs', { teacher, targetxxx, ClassModel })
                })
            })
        })
    }

    async docreateClass(req, res) {
        try {
            var studentID = req.body.studentID
            var listStudent = req.body.listStudent
            var data = await ClassModel.create({
                className: req.body.className,
                subject: req.body.subject,
                routeName: req.body.routeName,
                stage: req.body.stage,
                description: req.body.description,
                teacherID: req.body.teacherID,
                endDate: new Date(req.body.endDate),
                startDate: new Date(req.body.startDate),
            })
            if (!data) res.json({ msg: 'error' });
            var lol1 = await AccountModel.updateMany({ _id: { $in: studentID } }, { $push: { classID: data._id, subject: req.body.subject } })
            if (!lol1) res.json({ msg: 'error' });

            var lol2 = await ClassModel.findOneAndUpdate({ _id: data._id }, {
                $push: {
                    studentID: { $each: listStudent },
                    StudentIDoutdoor: { $each: listStudent },
                    schedule: { $each: req.body.schedual }
                }
            })
            if (!lol2) res.json({ msg: 'error' });

            for (var i = 0; i < req.body.time.length; i++) {
                await assignRoomAndTimeModel.updateOne({ dayOfWeek: '0' + req.body.buoihoc[i], room: { $elemMatch: { room: req.body.room[i], time: req.body.time[i] } } }, {
                    $set: { "room.$.status": "Ok" }
                })
            }
            res.json({ msg: 'success' });
        } catch (error) {
            if (err) {
                res.json({ msg: 'error' });
            }
        }
    }

    allClassLevel(req, res) {
        ClassModel.find({}).populate('studentID').populate('teacherID').lean().exec((err, classInfor) => {
            res.render('admin/allClassLevel.hbs', { classInfor })
                // res.json(classInfor)
        })
    }

    allClassStudent(req, res) {
        var _id = req.query.abc
        ClassModel.find({ _id: _id }).populate('studentID').populate('teacherID').lean().exec((err, selectedClassInfor) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: selectedClassInfor });
            }
        })
    }

    editClass(req, res) {
        var skip = parseInt(req.query.sotrang)
        AccountModel.find({ role: req.query.role }).lean().countDocuments(function(err, numberOfAccount) {
            AccountModel.find({ role: req.query.role }).populate("guardian", { username: 1, avatar: 1 }).skip(skip).limit(1).lean().exec((err, data) => {
                if (err) {
                    res.json({ msg: 'error' });
                } else {
                    res.json({ msg: 'success', data, numberOfAccount });
                }
            })
        })
    }

    addStudentToClass(req, res) {}

    addTeacherToClass(req, res) {
        res.render('admin/addTeacherToClass')
            // res.json('Trang chỉ định giáo viên vào lớp ')
    }

    allProposal(req, res) {
        ClassModel.find().populate({ path: 'teacherID', select: 'username avatar' }).sort({ uploadDate: -1 }).lean().exec((err, data) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
            }
        })
    }

    rateProppsal(req, res) {
        var { _id, status, comment } = req.body
        ClassModel.findOneAndUpdate({ _id: _id }, { status, comment }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success' });
            }
        })
    }




    dashboard(req, res) {
        // tạo foolder mới
        //link hướng dẫn: https://developers.google.com/drive/api/v3/folder#node.js
        var fileMetadata = {
            'name': 'Invoices',
            'mimeType': 'application/vnd.google-apps.folder'
        };
        var folder = driveService.files.create({
            resource: fileMetadata,
            fields: 'id'
        }, function(err, file) {
            if (err) {
                // Handle error
                console.error(err);
            } else {
                console.log('Folder Id: ', file.data.id);
            }
        });
        res.render('admin/dashboard')
            // res.json('Trang xem thông tin dashboard')
    }

    async createEvent(req, res) {
        var eventAt = new Date(req.body.eventAt);
        eventAt.setDate(eventAt.getDate() - 4);
        var date = eventAt.getDate().toString().padStart(2, "0");;
        var month = (eventAt.getMonth() + 1).toString().padStart(2, "0");
        eventAt = eventAt.getFullYear() + "-" + month + "-" + date
        if (eventAt < req.body.eventProposal) {
            res.json({ msg: 'hạn nộp đề xuất phải sớm hơn sự kiện 4 ngày' });
        } else {
            try {
                var fileMetadata = {
                    'name': req.body.eventName,
                    'mimeType': 'application/vnd.google-apps.folder',
                    'parents': ['1qQ47mPS-x1lG7SzdCw_XrHzime9wpmkg'] //chọn file muốn lưu vào ở drive. Id của folder ở trên link url
                };
                var folder = await driveService.files.create({
                    resource: fileMetadata,
                    fields: 'id'
                })
                await eventModel.create({
                    eventName: req.body.eventName,
                    eventContent: req.body.eventContent,
                    eventAddress: req.body.eventAddress,
                    eventAt: req.body.eventAt,
                    eventProposal: eventAt,
                    folderID: folder.data.id,
                })
                res.json({ msg: 'success' });
            } catch (err) {
                if (err) {
                    res.json({ msg: 'error' });
                }
            }
        }
    }

    allEvent(req, res) {
        eventModel.find({}).lean().sort({ eventAt: -1 }).exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
            }
        })
    }

    async deleteEvent(req, res) {
        var folderID
        try {
            folderID = await eventModel.findOne({ _id: req.body.id }, { folderID: 1 }).lean()
            var responese = await driveService.files.delete({ fileId: folderID.folderID, })
            var data = await eventModel.deleteOne({ _id: req.body.id }).lean().sort({ eventAt: -1 })
            res.json({ msg: 'success', data });
        } catch (err) {
            if (err) {
                res.json({ msg: 'error' });
            }
        }
    }

    doUpdateEvent(req, res) {
        var eventAt = new Date(req.body.eventAt);
        eventAt.setDate(eventAt.getDate() - 4);
        var date = eventAt.getDate().toString().padStart(2, "0");;
        var month = (eventAt.getMonth() + 1).toString().padStart(2, "0");
        eventAt = eventAt.getFullYear() + "-" + month + "-" + date
        if (eventAt < req.body.eventProposal) {
            res.json({ msg: 'hạn nộp đề xuất phải sớm hơn sự kiện 4 ngày' });
        } else {
            eventModel.findOneAndUpdate({ _id: req.body.id }, {
                eventName: req.body.eventName,
                eventContent: req.body.eventContent,
                eventAddress: req.body.eventAddress,
                eventAt: req.body.eventAt,
                eventProposal: eventAt,
            }, function(err, data) {
                if (err) {
                    res.json({ msg: 'error' });
                } else {
                    res.json({ msg: 'success' });
                }
            })
        }
    }

    allEventProposal(req, res) {
        eventModel.find({ _id: req.query.id }, { proposals: 1 }).populate({ path: 'proposals.teacherID', select: 'username avatar' }).lean().exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
            }
        })
    }

    async dorateEventProposal(req, res) {
        try {
            var data = await eventModel.findOneAndUpdate({ _id: req.body.idProposal, "proposals._id": req.body.IDlinkProposal }, {
                $set: { "proposals.$.status": req.body.status, "proposals.$.comment": req.body.comment }
            })
            res.json({ msg: 'success', data });
        } catch (e) {
            if (e) {
                res.json({ msg: 'error' })
            }
        }
    }

    consultingAll(req, res) {
        var month = req.query.month
        consultingInformationModel.find({ signTime: { $gt: req.query.start, $lt: req.query.end } }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data, month });
            }
        })
    }

}
module.exports = new adminController