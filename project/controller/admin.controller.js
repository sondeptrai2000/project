const { JsonWebTokenError } = require('jsonwebtoken');
const AccountModel = require('../models/account');
const ClassModel = require('../models/class');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { data } = require('jquery');
const saltRounds = 10;
class adminController {
    adminHome(req, res) {
        res.json('Trang chủ admin')
    }

    createAccount(req, res) {
        ClassModel.find({}, function(err, classInfor) {
            res.render('admin/createAccount', { classInfor })
        })
    }

    docreateAccount(req, res) {
        try {
            let { username, password, email, classID, role, level, phone, address, birthday } = req.body
            AccountModel.find({ username: username }, function(err, result) {
                if (result.length !== 0) {
                    res.json('tài khoản đã tồn tại')
                } else {
                    if (username && password) {
                        const salt = bcrypt.genSaltSync(saltRounds);
                        const hash = bcrypt.hashSync(password, salt);
                        AccountModel.create({
                            username,
                            password: hash,
                            email,
                            classID,
                            role,
                            level,
                            phone,
                            address,
                            birthday
                        });
                    }
                    return res.status(200).json({
                        message: "Sign Up success",
                        error: false
                    })
                }
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

    editAccount(req, res) {
        res.render('admin/editAccount')
    }

    //làm cuối
    doeditAccount(req, res) {
        try {
            let { _id, username, password, email, classID, role, phone, address, birthday } = req.body
            AccountModel.findOneAndUpdate({ username: username }, function(err, result) {
                if (result.length !== 0) {
                    res.json('tài khoản đã tồn tại')
                } else {
                    if (username && password) {
                        const salt = bcrypt.genSaltSync(saltRounds);
                        const hash = bcrypt.hashSync(password, salt);
                        AccountModel.create({
                            username,
                            password: hash,
                            email,
                            classID,
                            role,
                            phone,
                            address,
                            birthday
                        });
                    }
                    return res.status(200).json({
                        message: "Sign Up success",
                        error: false
                    })
                }
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
            console.log('className', className)
            console.log('description', description)
            console.log('startDate', startDate)
            console.log('endDate', endDate)
            console.log('level', level)
            console.log('StudentID', studentID)
            console.log('TeacherID', teacherID)
                // ClassModel.findOne({ classname: classname, startDate: startDate, endDate: endDate }, function(err, result) {
                //     if (result.length !== 0) {
                //         res.json('Lớp học đã tồn tại')
                //     } else {
            ClassModel.create({
                className,
                level,
                description,
                studentID,
                teacherID,
                endDate,
                startDate
            });
            return res.status(200).json({
                    message: "Sign Up success",
                    error: false
                })
                //     }
                // })
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
        ClassModel.find({ className: 'Speak' }).populate('studentID').exec((err, user) => {
                console.log(user)
                res.json(user)
            })
            // res.render('admin/allClassLevel')
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