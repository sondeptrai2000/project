const { JsonWebTokenError } = require('jsonwebtoken');
const AccountModel = require('../models/account');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { data } = require('jquery');
const saltRounds = 10;
const nodemailer = require('nodemailer');


const Crypto = require('crypto')

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

let getCode = async(req, res) => {
    try {
        console.log(req.query.email)
        var check = await AccountModel.findOne({ email: req.query.email }, { username: 1 })
        if (check) {
            var code = Crypto.randomBytes(21).toString('base64').slice(0, 21)
            var content = check.username + " mã code để làm mới mật khẩu của bạn là: " + code + ". Note: Mã này sẽ tồn tại trong 5p."
            var mainOptions = {
                from: 'fptedunotification@gmail.com',
                to: req.query.email,
                subject: 'Notification',
                text: content
            }
            await AccountModel.findOneAndUpdate({ email: req.query.email }, { codeRefresh: code })
            await transporter.sendMail(mainOptions)
            setTimeout(async function() {
                await AccountModel.findOneAndUpdate({ email: req.query.email }, { codeRefresh: "" })
            }, 600000)
            res.json({ msg: 'success' });
        }
        if (!check) res.json({ msg: 'email not found' });
    } catch (e) {
        console.log(e)
        res.json({ msg: 'error' });
    }
}


let confirmPass = async(req, res) => {
    try {
        var check = await AccountModel.findOne({ email: req.body.email }, { username: 1, codeRefresh: 1 })
        if (check) {
            if (check.codeRefresh == req.body.codeForgot) {
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(req.body.newPass, salt);
                await AccountModel.findOneAndUpdate({ email: req.body.email }, { codeRefresh: "", password: hash })
                res.json({ msg: 'success' });
            } else { res.json({ msg: 'invalidCode' }); }
        }
        if (!check) res.json({ msg: 'email not found' });
    } catch (e) {
        console.log(e)
        res.json({ msg: 'error' });
    }
}


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
            res.json({ message: "error" })
        }
        if (result) {
            let token = jwt.sign({ _id: req.user._id }, 'minhson', { expiresIn: '1d' })
            res.cookie("token", token, { maxAge: 24 * 60 * 60 * 10000 });
            let user = req.user
            if (user.role === "admin") {
                res.json({ msg: 'success', data: "./homeAdmin" });
                // res.redirect("./homeAdmin")
            }
            if (user.role === "student") {
                res.json({ msg: 'success', data: "./homeStudent" });
                // res.redirect("./homeStudent")
            }
            if (user.role === "guardian") {
                res.json({ msg: 'success', data: "./homeGuardian" });
                // res.redirect("./homeGuardian")
            }
            if (user.role === "teacher") {
                res.json({ msg: 'success', data: "./homeTeacher" });
                // res.redirect("./homeTeacher")
            }
        } else {
            console.log("234")
            res.json({ msg: 'invalid_Info', message: "Username or password is invalid" });
            // res.render('index/login', { message: message })
        }
    })
}


module.exports = {
    homeAdmin,
    homeGuardian,
    homeStudent,
    homeTeacher,
    loginController,
    getCode,
    confirmPass
}