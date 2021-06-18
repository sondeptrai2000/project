const AccountModel = require('../models/account')
const ClassModel = require('../models/class');
const chatModel = require('../models/messenger');

const { data, param, css } = require('jquery')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt');
const mongodb = require("mongodb");

class messtController {
    //ấn chat vào người bất kỳ r dẫn đến form chat và lịch sử
    makeConnection(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.findOne({ _id: decodeAccount }, function(err, sender) {
            var formData = {
                studentName: req.body.studentName,
                sender: sender.username,
            }
            var condition = {
                person1: sender.username,
                person2: req.body.studentName,
            }

            var condition1 = {
                person1: req.body.studentName,
                person2: sender.username,
            }

            var createConnection = {
                person1: sender.username,
                person2: req.body.studentName,
                message: {
                    ownermessenger: "Hệ thống",
                    messContent: "Đã kết nối! Ấn vào để chat",
                }
            }
            chatModel.find({ $or: [condition, condition1] }, function(err, data) {
                if (err) {
                    res.json({ msg: 'error' });
                } else if (data.length == 0) {
                    chatModel.create(createConnection, function(err, data) {
                        if (err) {
                            res.json({ msg: 'có lỗi trogn khi tạo cuộc trò chuyện' });
                        } else {
                            chatModel.find({ $or: [{ person1: sender.username }, { person2: sender.username }] }).sort({ updateTime: -1 }).exec(function(err, data1) {
                                res.render("message/chat.ejs", { formData, data, data1 })
                            })
                        }
                    });
                } else {
                    chatModel.find({ $or: [{ person1: sender.username }, { person2: sender.username }] }, {
                        // lấy tin nhắn cuối cùng trong mảng message
                        message: { $slice: -1 }
                    }).sort({ updateTime: -1 }).exec(function(err, data1) {
                        res.render("message/chat.ejs", { formData, data, data1 })
                    })
                }
            })
        })
    }

    //lịch sử chat, hiển thị tin nhắn đầu trong danh sách
    chatForm(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.findOne({ _id: decodeAccount }, function(err, sender) {
            var formData = {
                sender: sender.username
            }
            chatModel.find({ $or: [{ person1: sender.username }, { person2: sender.username }] }, {
                // lấy tin nhắn cuối cùng trong mảng message
                message: { $slice: -1 }
            }).sort({ updateTime: -1 }).exec(function(err, data1) {
                res.render("message/chatForm.ejs", { data1, formData })
            })
        });

    }
    getMessenger(req, res) {
        var condition = {
            person1: req.query.receiver,
            person2: req.query.sender,
        }

        var condition1 = {
            person1: req.query.sender,
            person2: req.query.receiver,
        }
        chatModel.find({ $or: [condition, condition1] },
            function(err, data) {
                if (err) {
                    res.json({ msg: 'error' });
                } else {
                    res.json({ msg: 'success', data: data });
                }
            })
    }

}
module.exports = new messtController;