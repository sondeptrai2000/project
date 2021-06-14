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
            console.log("StudentID: " + req.query.studentID + " Name: " + req.query.studentName)
            console.log("TeacherID: " + sender._id + " Name: " + sender.username)
            var formData = {
                studentID: req.query.studentID,
                studentName: req.query.studentName,
                sender: sender.username,
                senderID: sender._id
            }
            if (sender.role === 'teacher') { // giáo viên chủ động nhắn tin
                var condition = { person1: sender.username, person2: req.query.studentName }
            } else if (sender.role === 'student' || sender.role === 'guardian') {
                var condition = { person1: req.query.studentName, person2: sender.username }
            }
            chatModel.find(condition, function(err, data) {
                if (err) {
                    res.json({ msg: 'error' });
                } else if (data.length == 0) {
                    chatModel.create(condition, function(err, data) {
                        if (err) {
                            res.json({ msg: 'có lỗi trogn khi tạo cuộc trò chuyện' });
                        } else {
                            res.json({ msg: 'tạo cuộc trò chuyện thành công', data: data });
                        }
                    });
                } else {
                    res.render("chat", { formData })

                }
            })
        })
    }

    chatBox(req, res) {
        res.render("chat.hbs")
    }

}
module.exports = new messtController;