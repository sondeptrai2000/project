const { JsonWebTokenError } = require('jsonwebtoken');
const AccountModel = require('../models/account');
const ClassModel = require('../models/class');
const studyRouteModel = require('../models/studyRoute');
const extracurricularActivitiesModel = require('../models/extracurricularActivities');

var path = require('path');

const { google } = require("googleapis")
const CLIENT_ID = "279772268126-bdo0c5g58jriuo7l057rdphld66t8cmj.apps.googleusercontent.com"
const CLIENT_SECRET = "4FHV8fvNK4ZLyfPBzi5SDs7a"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = "1//04hkstXaqmlvyCgYIARAAGAQSNwF-L9Irk7DfaT5oiNwsQdGnTolco5UEP96BNf-cSHjWGfXfbE9b5RVb_ieNd01P7oyahLOtTZY"

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

const filePath = path.join(__dirname, 'slide-1.jpg')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { data } = require('jquery');
const saltRounds = 10;
var fs = require('fs')
class adminController {
    adminHome(req, res) {
        res.render('admin/adminHome')
    }

    getAccount(req, res) {
        AccountModel.find({ role: req.query.role }).lean().countDocuments(function(err, numberOfAccount) {
            var skip = parseInt(req.query.sotrang) * 3
            var soTrang = numberOfAccount / 3 + 1
            AccountModel.find({ role: req.query.role }).populate("guardian", { username: 1, avatar: 1 }).skip(skip).limit(3).lean().exec((err, data) => {
                if (err) {
                    res.json({ msg: 'error' });
                } else {
                    res.json({ msg: 'success', data, numberOfAccount, soTrang });
                }
            })
        })
    }

    createAccount(req, res) {
        AccountModel.find({ role: "teacher" }).lean().countDocuments(function(err, numberOfAccount) {
            studyRouteModel.find({}).lean().exec(function(err, targetxxx) {
                AccountModel.find({ role: "teacher" }).lean().then(data => {
                    ClassModel.find({}).lean().exec(function(err, classInfor) {
                        res.render('admin/createAccount', { data, classInfor, targetxxx, numberOfAccount })
                    })
                })
            })
        })

    }
    getRoute(req, res) {
        studyRouteModel.find({}).lean().exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
            }
        })
    }

    getStage(req, res) {
        studyRouteModel.find({ routeName: req.query.abc }).lean().exec(function(err, targetxxx) {
            AccountModel.find({ role: 'student', routeName: req.query.abc, stage: req.query.levelS }).lean().exec(function(err, student) {
                studyRouteModel.find({ routeName: req.query.abc }).lean().exec(function(err, data) {
                    if (err) {
                        res.json({ msg: 'error' });
                    } else {
                        res.json({ msg: 'success', data, student, targetxxx });
                    }
                })
            })
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

    docreateRoute(req, res) {

        var stageContent = req.body.stageContent
        var route = req.body.route
        var testthu = route.toString();
        testthu = testthu.split(",space,")
        var totalStage = req.body.totalStage
        studyRouteModel.create({
            routeName: req.body.routeName,
            description: req.body.description,
        }, function(err, data) {
            for (var i = 0; i < totalStage; i++) {
                testthu[i] = testthu[i].toString();
                testthu[i] = testthu[i].split(",")
                studyRouteModel.updateOne({ _id: data._id }, {
                    $push: {
                        routeSchedual: {
                            stage: stageContent[i],
                            routeabcd: testthu[i],
                        }
                    }
                }, function(err, data) {
                    if (err) {
                        res.json({ msg: 'Account already exists' });
                    }

                })
            }
        })
        res.json({ msg: 'success' });
    }


    async doCreateAccount(req, res) {
        var fileID
        var path = __dirname.replace("controller", "public/avatar") + '/' + req.body.filename;
        var image = req.body.file;
        var data = image.split(',')[1];
        fs.writeFileSync(path, data, { encoding: 'base64' });
        var temp = fs.readFileSync(path);
        var buff = new Buffer(temp);
        var base64data = buff.toString('base64');
        try {
            const response = await drive.files.create({
                requestBody: {
                    name: req.body.filename, //đặt tên
                    parents: ['11B3Y7b7OJcbuqlaHPJKrsR2ow3ooKJv1'] //chọn file muốn lưu vào ở drive. Id của folder ở trên link url
                },
                media: {
                    body: fs.createReadStream(path),
                },
            });

            // console.log(response.data);
            await drive.permissions.create({
                fileId: response.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
        } catch (error) {
            console.log(error.message);
        }
        try {
            let { username, password, email, phone, address, birthday } = req.body
            let role = req.body.role
            let stage = req.body.stage
            let routeName = req.body.routeName
            let aim = req.body.aim
            if (role === "guardian" || role === "teacher") {
                stage = "none"
                routeName = "none"
                aim = "none"
            }
            fileID = "https://drive.google.com/uc?export=view&id=" + fileID
            AccountModel.find({ username: username }).lean().exec(function(err, result) {
                if (result.length !== 0) {
                    res.json({ msg: 'Account already exists' });
                } else {
                    if (username && password) {
                        const salt = bcrypt.genSaltSync(saltRounds);
                        const hash = bcrypt.hashSync(password, salt);
                        AccountModel.create({
                            avatar: fileID,
                            username,
                            password: hash,
                            email,
                            role,
                            routeName,
                            aim,
                            stage,
                            phone,
                            address,
                            birthday
                        }, function(err, data) {
                            if (err) {
                                res.json({ msg: 'error' });
                            } else {
                                res.json({ msg: 'success', data: data });
                            }
                        });
                    }

                }
            })
        } catch (error) {
            if (error) {
                res.status(400).json({
                    msg: "Sign Up fail",
                    error: true
                })
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
    doeditAccount(req, res) {
        let role = req.body.role
        let stage = req.body.stage
        let routeName = req.body.routeName
        let aim = req.body.aim
        if (role === "guardian" || role === "teacher") {
            stage = "none"
            routeName = "none"
            aim = "none"
        }
        let password = req.body.password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        var update = {
            username: req.body.username,
            password: hash,
            email: req.body.email,
            role: req.body.role,
            routeName: routeName,
            aim: aim,
            stage: stage,
            phone: req.body.phone,
            address: req.body.address,
            birthday: req.body.birthday
        }
        if (req.body.file != "none") {
            update["avatar"] = req.body.file
        }
        AccountModel.findOneAndUpdate({ _id: req.body._id }, update, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    createClass(req, res) {
        studyRouteModel.find({}).lean().exec(function(err, targetxxx) {
            AccountModel.find({ role: 'student' }).lean().exec(function(err, student) {
                AccountModel.find({ role: 'teacher' }).lean().exec(function(err, teacher) {
                    res.render('admin/createClass.ejs', { student, teacher, targetxxx })
                })
            })
        })

    }

    docreateClass(req, res) {
        try {
            let getStudentID = req.body.hobby
            var studentID = []
            if (Array.isArray(getStudentID) == false) {
                studentID.push(req.body.hobby)
            } else {
                studentID = getStudentID
            }
            ClassModel.create({
                className: req.body.className,
                subject: req.body.subject,
                routeName: req.body.routeName,
                stage: req.body.stage,
                description: req.body.description,
                teacherID: req.body.facultyID,
                endDate: req.body.endDate,
                startDate: req.body.startDate,
            }, function(err, data) {
                if (err) {
                    res.json("lỗi k tạo được")
                } else {
                    for (var i = 0; i < studentID.length; i++) {
                        AccountModel.findOneAndUpdate({ _id: studentID[i] }, { $push: { classID: data._id } }, function(err, teacher) {})
                        ClassModel.findOneAndUpdate({ _id: data._id }, { $push: { studentID: { ID: studentID[i] } } }, function(err, teacher) {
                            if (err) {
                                console.log("lỗi k tạo được")
                            }
                        })
                    }
                    AccountModel.findOneAndUpdate({ _id: req.body.facultyID }, { $push: { classID: data._id } }, function(err, teacher) {
                        return res.status(200).json({
                            message: "Sign Up success",
                            error: false
                        })
                    })
                }
            });
        } catch (error) {
            if (error) {
                res.status(400).json({
                    message: "Sign Up fail",
                    error: true
                })
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
        extracurricularActivitiesModel.find({}).populate({ path: 'classID', select: 'className' }).populate({ path: 'teacherID', select: 'username avatar' }).lean().sort({ uploadDate: -1 }).exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
            }
        })
    }

    rateProppsal(req, res) {
        let { _id, status, comment } = req.body
        extracurricularActivitiesModel.findOneAndUpdate({ _id: _id }, { status, comment }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
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
        var folder = drive.files.create({
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

}
module.exports = new adminController