const AccountModel = require('../models/account')
const ClassModel = require('../models/class');
const chatModel = require('../models/messenger');

const { data, param, css } = require('jquery')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt');
const mongodb = require("mongodb");

class messtController {
    makeConnection(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.findOne({ _id: decodeAccount }, function(err, sender) {
            var formData = {
                studentName: req.body.studentName,
                sender: sender.username,
                senderRole: sender.role
            }
            if (sender.role === 'teacher') { // giáo viên chủ động nhắn tin
                var condition = {
                    person1: sender.username,
                    person2: req.body.studentName,
                    message: {
                        ownermessenger: "Hệ thống",
                        messContent: "Đã kết nối! Ấn vào để chat",
                    }
                }
            } else if (sender.role === 'student' || sender.role === 'guardian') {
                var condition = {
                    person1: req.body.studentName,
                    person2: sender.username,
                    message: {
                        ownermessenger: "Hệ thống",
                        messContent: "Đã kết nối! Ấn vào để chat",
                    }
                }
            }
            chatModel.find(condition, function(err, data) {
                if (err) {
                    res.json({ msg: 'error' });
                } else if (data.length == 0) {
                    chatModel.create(condition, function(err, data) {
                        if (err) {
                            res.json({ msg: 'có lỗi trogn khi tạo cuộc trò chuyện' });
                        } else {
                            res.render("message/chat", { formData, data })
                        }
                    });
                } else {
                    res.render("message/chat", { formData, data })
                }
            })
        })
    }

    chatBoxHistory(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.findOne({ _id: decodeAccount }, function(err, sender) {
            var sender = sender.username
            var condition
            if (sender.role == 'teacher') {
                condition = { person1: sender.username }
            } else if (sender.role == 'student' || sender.role == 'guardian') {
                condition = { person2: sender.username }
            }
            chatModel.find(condition, function(err, data) {
                res.render('message/chatBoxHistory.ejs', { data, sender })
            })
        })
    }

}
module.exports = new messtController;