const AccountModel = require('../models/account');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer');
const fs = require("fs")
const { google } = require("googleapis")
var path = require('path');
const Crypto = require('crypto')

// set up mail sever
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'sownenglishedu@gmail.com',
        pass: 'son123@123'
    },
    tls: {
        rejectUnauthorized: false
    }
});


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

//thực hiện upflie lên ggdrive và trả về ID của file đó trên drive
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

let getCode = async(req, res) => {
    try {
        var check = await AccountModel.findOne({ email: req.query.email }, { username: 1 })
        if (check) {
            var code = Crypto.randomBytes(21).toString('base64').slice(0, 21)
            console.log(code)
            var content = check.username + " mã code để làm mới mật khẩu của bạn là: " + code + "\n Note: Mã này sẽ tồn tại trong 5p."
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
        console.log("vvaof")
        console.log(req.body.codeForgot)
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
let homeAdmin = async(req, res) => {
    try {
        let token = req.cookies.token
        if (token) {
            let decodeAccount = jwt.verify(token, 'minhson')
            var data = await AccountModel.findOne({ _id: decodeAccount }).lean()
            if (data.role === 'admin') res.render('admin/adminHome')
        } else {
            res.redirect('/')
        }
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
}

//ok
let homeTeacher = async(req, res) => {
    try {
        let token = req.cookies.token
        if (token) {
            let decodeAccount = jwt.verify(token, 'minhson')
            var data = await AccountModel.findOne({ _id: decodeAccount }).lean()
            if (data.role === 'teacher') res.render('teacher/teacherHome')
        } else {
            res.redirect('/')
        }
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
}

//ok
let homeGuardian = async(req, res) => {
    try {
        let token = req.cookies.token
        if (token) {
            let decodeAccount = jwt.verify(token, 'minhson')
            var data = await AccountModel.findOne({ _id: decodeAccount }).lean()
            if (data.role === 'guardian') res.render('guardian/guardianHome')
        } else {
            res.redirect('/')
        }
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
}


let homeStudent = async(req, res) => {
    try {
        let token = req.cookies.token
        if (token) {
            let decodeAccount = jwt.verify(token, 'minhson')
            var data = await AccountModel.findOne({ _id: decodeAccount }).lean()
            if (data.role === 'student') res.render('student/studentHome')
        } else {
            res.redirect('/')
        }
    } catch (e) {
        console.log(e)
        res.redirect('/')
    }
}

let loginController = async function(req, res) {
    try {
        var result = await bcrypt.compare(req.body.password, req.user.password)
        if (result == true) {
            let token = jwt.sign({ _id: req.user._id }, 'minhson', { expiresIn: '1d' })
            res.cookie("token", token, { maxAge: 24 * 60 * 60 * 10000 });
            let user = req.user
            if (user.role === "admin") res.json({ msg: 'success', data: "./homeAdmin" });
            if (user.role === "student") res.json({ msg: 'success', data: "./homeStudent" });
            if (user.role === "guardian") res.json({ msg: 'success', data: "./homeGuardian" });
            if (user.role === "teacher") res.json({ msg: 'success', data: "./homeTeacher" });
        } else { res.json({ msg: 'invalid_Info' }); }
    } catch (e) {
        console.log(e)
        res.json({ message: "error" })
    }
}
let doeditAccount = async function(req, res) {
    try {
        var check = await AccountModel.find({ email: req.body.formData1.email }).lean()
        var checkphone = await AccountModel.find({ phone: req.body.formData1.phone }).lean()
        if (check.length > 1) {
            res.json({ msg: 'Account already exists' })
        } else if (checkphone.length > 1) {
            res.json({ msg: 'Phone already exists' })
        } else {
            var password = req.body.password
            var formData1 = req.body.formData1
            if (password.length != 0) {
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(password, salt);
                formData1["password"] = hash
            }
            if (req.body.file != "none") {
                var path = __dirname.replace("controller", "public/avatar") + '/' + req.body.filename;
                var image = req.body.file;
                var data = image.split(',')[1];
                fs.writeFileSync(path, data, { encoding: 'base64' });
                var response = await uploadFile(req.body.filename, "11B3Y7b7OJcbuqlaHPJKrsR2ow3ooKJv1", path)
                if (!response) res.json({ msg: 'error' });
                formData1["avatar"] = "https://drive.google.com/uc?export=view&id=" + response
                var oldImg = req.body.oldLink
                if (oldImg) {
                    oldImg = oldImg.split("https://drive.google.com/uc?export=view&id=")[1]
                    await driveService.files.delete({ fileId: oldImg })
                }
            }
            await AccountModel.findOneAndUpdate({ _id: req.body.id }, formData1)
            res.json({ msg: 'success', data: data });
        }
    } catch (e) {
        console.log(e)
        res.json({ msg: 'error' });
    }
}

let profile = async function(req, res) {
    try {
        var token = req.cookies.token
        var decodeAccount = jwt.verify(token, 'minhson')
        var before = new Date();
        var data = await AccountModel.findOne({ _id: decodeAccount }).lean();
        res.cookie("username", data.username, { maxAge: 24 * 60 * 60 * 10000 });
        var after = new Date();
        console.log("profile: ", (after - before))
        res.json({ msg: 'success', data: data });
    } catch (e) {
        console.log(e)
        res.json({ msg: 'error' });
    }
}
module.exports = {
    homeAdmin,
    homeGuardian,
    homeStudent,
    homeTeacher,
    loginController,
    getCode,
    confirmPass,
    doeditAccount,
    profile
}