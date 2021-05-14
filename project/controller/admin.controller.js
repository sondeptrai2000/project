const { JsonWebTokenError } = require('jsonwebtoken');
const AccountModel = require('../models/account');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { data } = require('jquery');
const saltRounds = 10;
class adminController {
    adminHome(req, res) {
        res.json('Trang chủ admin')
    }

    createAccount(req, res) {
        res.render('admin/createAccount')
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
                console.log(student)
                res.render('admin/createClass.ejs', { student, teacher })
            })
        })
    }

    allClassLevel(req, res) {
        res.render('admin/allClassLevel')
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