const AccountModel = require('../models/account')
const ClassModel = require('../models/class');
const chatModel = require('../models/messenger');

const { data, param, css } = require('jquery')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt');
const mongodb = require("mongodb");

class messtController {
    //ấn chat vào người bất kỳ r dẫn đến form chat và lịch sử
    makeConnection(req, res, next) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.findOne({ _id: decodeAccount }, { username: 1, avatar: 1, chat: 1 }, function(err, sender) {
            var senderName = sender.username
            AccountModel.findOne({ username: req.body.studentName }, { avatar: 1, chat: 1 }, function(err, receiver) {
                var receiverName = req.body.studentName
                var person1ListChat = sender.chat
                var person2ListChat = receiver.chat
                var check = false
                for (let i = 0; i < person1ListChat.length; i++) {
                    for (let u = 0; u < person2ListChat.length; u++) {
                        if (person1ListChat[i] == person2ListChat[u]) {
                            check = true;
                            break;
                        }
                    }
                }
                if (check == false) {
                    var createConnection = {
                        person1: sender.username,
                        person1Ava: sender.avatar,
                        person2: req.body.studentName,
                        person2Ava: receiver.avatar,
                        message: {
                            ownermessenger: "Hệ thống",
                            messContent: "Đã kết nối! Ấn vào để chat",
                        }
                    }
                    chatModel.create(createConnection, function(err, data) {
                        if (err) {
                            res.json({ msg: 'có lỗi trogn khi tạo cuộc trò chuyện' });
                        } else {
                            AccountModel.updateMany({ username: { $in: [senderName, receiverName] } }, { $push: { chat: data._id } }, function(err, data) {
                                if (err) {
                                    res.json({ msg: 'Lỗi' });
                                }
                            })
                            next();
                        }
                    });
                } else {
                    next();
                }

            })
        })
    }

    chatForm(req, res) {
        // var lol = new Date
        // console.log("mới vào" + lol)
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.findOne({ _id: decodeAccount }, { username: 1, chat: 1 }, function(err, sender) {
            chatModel.find({ _id: { $in: sender.chat } }, {
                // lấy tin nhắn cuối cùng trong mảng message
                message: { $slice: -1 }
            }).sort({ updateTime: -1 }).exec(function(err, data1) {
                // var lol = new Date
                // console.log("lấy lsu chat" + lol)
                if (data1.length == "0") {
                    res.render("message/chatTrong.ejs")
                } else {
                    if (sender.username != data1[0].person1) {
                        var formData = {
                            sender: data1[0].person2,
                            senderAva: data1[0].person2Ava,
                            receiver: data1[0].person1,
                            receiverAva: data1[0].person1Ava,
                        }
                    }
                    if (sender.username != data1[0].person2) {
                        var formData = {
                            sender: data1[0].person1,
                            senderAva: data1[0].person1Ava,
                            receiver: data1[0].person2,
                            receiverAva: data1[0].person2Ava,
                        }
                    }
                    var listID = sender.chat
                    chatModel.findOne({ _id: data1[0]._id }, { message: 1 }).exec(function(err, data) {
                        if (err) {
                            res.json({ msg: 'error' });
                        } else {
                            // var lol = new Date
                            // console.log("lấy cuộc hội thoại" + lol)
                            res.render("message/chatBoxHistory.ejs", { data1, data, formData, listID })
                        }
                    })
                }
            })
        });
    }

    getMessenger(req, res) {
        chatModel.findOne({ _id: req.query._idRoom }).exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                var lol = new Date
                console.log("lấy cuộc hội thoại" + lol)
                res.json({ msg: 'success', data });
            }
        })
    }


    addChat(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        var receiverName = req.body.receiver
        AccountModel.findOne({ username: receiverName }, { username: 1, avatar: 1, chat: 1 }, function(err, data) {
            if (err) {
                res.json({ msg: 'lỗi khi tìm kiếm user' });
            } else if (data) {
                var receiverAva = data.avatar
                AccountModel.findOne({ _id: decodeAccount }, { username: 1, avatar: 1, chat: 1 }, function(err, sender) {
                    var senderName = sender.username
                    var senderAva = sender.avatar
                    if (senderName != receiverName) {
                        var person1ListChat = sender.chat
                        var person2ListChat = data.chat
                        var check = false
                        for (var i = 0; i < person1ListChat.length; i++) {
                            for (var u = 0; u < person2ListChat.length; u++) {
                                if (person1ListChat[i] == person2ListChat[u]) {
                                    check = true;
                                    break;
                                }
                            }
                        }
                        if (check == false) {
                            var createConnection = {
                                person1: senderName,
                                person1Ava: senderAva,
                                person2: receiverName,
                                person2Ava: receiverAva,
                                message: {
                                    ownermessenger: "Hệ thống",
                                    messContent: "Đã kết nối! Ấn vào để chat",
                                }
                            }
                            chatModel.create(createConnection, function(err, data) {
                                if (err) {
                                    res.json({ msg: 'có lỗi trogn khi tạo cuộc trò chuyện' });
                                } else {
                                    AccountModel.updateMany({ username: { $in: [senderName, receiverName] } }, { $push: { chat: data._id } }, function(err, data) {
                                        if (err) {
                                            res.json({ msg: 'Lỗi' });
                                        }
                                    })
                                    var _idRoom = data._id
                                    res.json({ msg: 'tạo cuộc hội thoại thành công', senderName, _idRoom, receiverName, senderAva, receiverAva });
                                }
                            });
                        } else {
                            res.json({ msg: 'cuộc hội thoại đã được tạo', senderName, data, receiverName, senderAva, receiverAva });
                        }
                    } else {
                        res.json({ msg: 'Bạn không thể tạo cuộc trò chuyện với chính mình' });
                    }
                })
            } else if (!data) {
                res.json({ msg: 'user not found' });
            }
        })
    }
}


module.exports = new messtController;