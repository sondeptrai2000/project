const { JsonWebTokenError } = require('jsonwebtoken');
const AccountModel = require('../models/account');
const ClassModel = require('../models/class');
const studyRouteModel = require('../models/studyRoute');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { data } = require('jquery');
const saltRounds = 10;
var fs = require('fs')
class adminController {
    adminHome(req, res) {
        res.render('admin/adminHome')
    }

    allTeacher(req, res) {
        AccountModel.find({ role: "teacher" }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    allStudent(req, res) {
        AccountModel.find({ role: "student" }).populate('studentID').populate('teacherID').exec((err, data) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }
    allGuardian(req, res) {
        AccountModel.find({ role: "guardian" }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    createAccount(req, res) {
        AccountModel.find({ role: "teacher" })
            .then(data => {
                ClassModel.find({}, function(err, classInfor) {
                    res.render('admin/createAccount', { data, classInfor })
                })
            })

    }

    createRoute(req, res) {
        res.render('admin/createRoute')
    }

    test(req, res) {
        var stage = ['1assdf', '2asdfvdwf', '3afghyrter']
        var route = ['route1', 'route2', 'route3', 'space', 'route1', 'route2', 'space', 'route1', 'route2']
        var testthu = route.toString();
        testthu = testthu.split(",space,")
        console.log(testthu[0])
        console.log(testthu[0])
            // for (var i = 0; i < 3; i++) {
            //     console.log(stage[i])
            //     studyRouteModel.updateOne({ _id: "60b7b7a3cfbf8a0928ab04a1" }, {
            //         $push: {
            //             routeSchedual: {
            //                 stage: stage[i],
            //                 routeabcd: routeabcd
            //             }
            //         }
            //     }, function(err, data) {
            //         if (err) {
            //             console.log("lỗi vcl")
            //         }
            //     })
            // }
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


    doCreateAccount(req, res) {
        var path = './public/uploads/' + req.body.filename;
        var image = req.body.file;
        var data = image.split(',')[1];
        fs.writeFileSync(path, data, { encoding: 'base64' });
        var temp = fs.readFileSync(path);
        var buff = new Buffer(temp);
        var base64data = buff.toString('base64');
        try {
            let { username, password, email, role, level, phone, address, birthday } = req.body
            AccountModel.find({ username: username }, function(err, result) {
                if (result.length !== 0) {
                    res.json({ msg: 'Account already exists' });
                } else {
                    if (username && password) {
                        const salt = bcrypt.genSaltSync(saltRounds);
                        const hash = bcrypt.hashSync(password, salt);
                        AccountModel.create({
                            avatar: base64data,
                            username,
                            password: hash,
                            email,
                            role,
                            level,
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
        AccountModel.find({ _id: req.query.updateid }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                console.log(data)
                res.json({ msg: 'success', data: data });
            }
        })
    }

    //làm cuối
    doeditAccount(req, res) {
        res.json("ok")
    }

    createClass(req, res) {
        AccountModel.find({ role: 'student' }, function(err, student) {
            AccountModel.find({ role: 'teacher' }, function(err, teacher) {
                res.render('admin/createClass.ejs', { student, teacher })
            })
        })
    }

    docreateClass(req, res) {
        try {
            // let { className, level, description, StudentID, TeacherID, endDate, startDate } = req.body
            let className = req.body.className
            let level = req.body.classLevel
            let description = req.body.description
            let studentID = req.body.hobby
            let teacherID = req.body.facultyID
            let endDate = req.body.endDate
            let startDate = req.body.startDate



            ClassModel.create({
                className,
                level,
                description,
                studentID,
                teacherID,
                endDate,
                startDate
            }, function(err, data) {
                console.log(data._id)
                for (var i = 0; i < studentID.length; i++) {
                    AccountModel.findOneAndUpdate({ _id: studentID[i] }, { $push: { classID: data._id } }, function(err, teacher) {})
                }
                AccountModel.findOneAndUpdate({ _id: teacherID }, { $push: { classID: data._id } }, function(err, teacher) {})
            });
            return res.status(200).json({
                message: "Sign Up success",
                error: false
            })
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
        ClassModel.find({}).populate('studentID').populate('teacherID').exec((err, classInfor) => {
            res.render('admin/allClassLevel.hbs', { classInfor })
                // res.json(classInfor)
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

    editClass(req, res) {
        res.render('admin/editClass')
            // res.json('Trang trỉnh sủa thông tin các lớp học')
    }

    addStudentToClass(req, res) {
        res.render('admin/addStudentToClass')
            // res.json('Trang thêm học sinh vào lớp ')
    }

    addTeacherToClass(req, res) {
        res.render('admin/addTeacherToClass')
            // res.json('Trang chỉ định giáo viên vào lớp ')
    }

    allextracurricularActivities(req, res) {
        res.render('admin/allextracurricularActivities')
            // res.json('Trang xem tất cả các hoạt động ngoại khóa (chưa duyệt, đã duyệt và đã được thực hiện)')
    }

    extracurricularActivities(req, res) {
        res.render('admin/extracurricularActivities')
            // res.json('Trang xem thông tin hoạt động ngoại khóa đã chọn')
    }


    dashboard(req, res) {
        res.render('admin/dashboard')
            // res.json('Trang xem thông tin dashboard')
    }

}
module.exports = new adminController