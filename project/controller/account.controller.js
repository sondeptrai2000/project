const { JsonWebTokenError } = require('jsonwebtoken');
const AccountModel = require('../models/account');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { data } = require('jquery');
const saltRounds = 10;

//ok
let homeAdmin = (req, res) => {
    let token = req.cookies.token
    let decodeAccount = jwt.verify(token, 'minhson')
    AccountModel.findOne({ _id: decodeAccount })
        .then(data => {
            if (data.role === 'admin') {
                res.render('admin/adminHome', { account: data })
            } else {
                res.render('index/login')
            }
        })
}

//ok
let homeTeacher = (req, res) => {
    let token = req.cookies.token
    let decodeAccount = jwt.verify(token, 'minhson')
    AccountModel.findOne({ _id: decodeAccount })
        .then(data => {
            if (data.role === 'teacher') {
                res.render('teacher/teacherHome', { account: data })
            } else {
                res.render('index/login')
            }
        })
}

//ok
let homeGuardian = (req, res) => {
    let token = req.cookies.token
    let decodeAccount = jwt.verify(token, 'minhson')
    AccountModel.findOne({ _id: decodeAccount })
        .then(data => {
            if (data.role === 'guardian') {
                res.render('guardian/guardianHome', { account: data })
            } else {
                res.render('index/login')
            }
        })
}

//ok
let homeStudent = (req, res) => {
    let token = req.cookies.token
    let decodeAccount = jwt.verify(token, 'minhson')
    AccountModel.findOne({ _id: decodeAccount })
        .then(data => {
            if (data.role === 'student') {
                res.render('student/studentHome', { account: data })
            } else {
                res.render('index/login')
            }
        })
}

let loginController = function(req, res) {
    bcrypt.compare(req.body.password, req.user.password, function(err, result) {
        if (err) {
            return res.status(500).json({
                message: "loi sever",
                status: 500,
                error: true
            })
        }
        if (result) {
            let token = jwt.sign({ _id: req.user._id }, 'minhson', { expiresIn: '1d' })
            res.cookie("token", token, { maxAge: 24 * 60 * 60 * 10000 });
            let user = req.user
            if (user.role === "admin") {
                res.redirect("./homeAdmin")
            }
            if (user.role === "student") {
                res.redirect("./homeStudent")
            }
            if (user.role === "guardian") {
                res.redirect("./homeGuardian")
            }
            if (user.role === "teacher") {
                res.redirect("./homeTeacher")
            }
        } else {
            var message = "Username or password is invalid"
            res.render('index/login', { message: message })
        }
    })
}


module.exports = {
    homeAdmin,
    homeGuardian,
    homeStudent,
    homeTeacher,
    loginController
}