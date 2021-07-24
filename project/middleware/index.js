// let { checkEmail} = require('../service/auth')
// let accountmodel = require('../models/account');
let AccountModel = require('../models/account');
var jwt = require('jsonwebtoken');

let checkLogin = async(req, res, next) => {
    try {
        let user = req.body.username;
        await AccountModel.findOne({
            username: user
        }).then(user => {
            if (!user) {
                res.json({ msg: 'invalid_Info', message: "Username or password is invalid" });
            } else {
                req.user = user
                next();
            }
        })
    } catch (error) {
        console.log(error)
        res.json({ message: "error" })
    }
}

let getUserById = function getUserById(id) {
    return AccountModel.findOne({ _id: id })
}
let checkAuth = async(req, res, next) => {
    try {
        var token = req.cookies.token || req.body.token
        let decodeAccount = jwt.verify(token, 'minh')
        let user = await getUserById(decodeAccount._id)
        if (user) {
            req.userLocal = user;
            next();
        } else {
            return res.status(400).json({
                message: "tk k ton tai",
                status: 400,
                error: true,
            })
        }
    } catch (error) {
        res.status(500).json({
                message: "hay dang nhap",
                status: 500,
                error: true
            },
            res.redirect('/'))
    }
}

let checkAdmin = (req, res, next) => {
    if (req.userLocal.role === "admin") {
        next()
    } else {
        return res.status(400).json({
            message: "no permission",
            status: 400,
            error: true,
        })
    }
}
let checkCoordinator = (req, res, next) => {
    if (req.userLocal.role === "coordinator") {
        next()
    } else {
        return res.status(400).json({
            message: "no permission",
            status: 400,
            error: true,
        })
    }
}
let checkStudent = (req, res, next) => {
    if (req.userLocal.role === "student") {
        next()
    } else {
        return res.status(400).json({
            message: "no permission",
            status: 400,
            error: true,
        })
    }
}
module.exports = {
    checkLogin,
    checkAdmin,
    checkAuth,
    getUserById,
    checkCoordinator,
    checkStudent
}