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
                person1ID: sender._id,
                person2: req.body.studentName,
                person2ID: req.body.studentID,
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
                            chatModel.find({ $or: [{ person1: sender.username }, { person2: sender.username }] }, {
                                message: { $slice: -1 } // lấy tin nhắn cuối cùng trong mảng message
                            }).sort({ updateTime: -1 }).exec(function(err, data1) {
                                if (data1.length == "0") {
                                    res.render("message/chatTrong.ejs")
                                } else {
                                    if (sender.username != data1[0].person1) {
                                        var formData = {
                                            sender: sender.username,
                                            receiver: data1[0].person1
                                        }
                                    }
                                    if (sender.username != data1[0].person2) {
                                        var formData = {
                                            sender: sender.username,
                                            receiver: data1[0].person2
                                        }
                                    }
                                    res.render("message/chatBoxHistory.ejs", { data1, formData })
                                }
                            })
                        }
                    });
                } else {
                    chatModel.find({ $or: [{ person1: sender.username }, { person2: sender.username }] }, {
                        // lấy tin nhắn cuối cùng trong mảng message
                        message: { $slice: -1 }
                    }).sort({ updateTime: -1 }).exec(function(err, data1) {
                        if (sender.username != data1[0].person1) {
                            var formData = {
                                sender: sender.username,
                                receiver: data1[0].person1
                            }
                        }
                        if (sender.username != data1[0].person2) {
                            var formData = {
                                sender: sender.username,
                                receiver: data1[0].person2
                            }
                        }
                        res.render("message/chatBoxHistory.ejs", { data1, formData })
                    })
                }
            })
        })
    }

    //lịch sử chat, hiển thị tin nhắn đầu trong danh sách
    chatForm(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.findOne({ _id: decodeAccount }, { avatar: 1, username: 1 }, function(err, sender) {
            chatModel.find({ $or: [{ person1: sender.username }, { person2: sender.username }] }, {
                // lấy tin nhắn cuối cùng trong mảng message
                message: { $slice: -1 }
            }).populate('person1ID', { avatar: 1 }).populate('person2ID', { avatar: 1 }).sort({ updateTime: -1 }).exec(function(err, data1) {
                if (data1.length == "0") {
                    res.render("message/chatTrong.ejs")
                } else {
                    if (sender.username != data1[0].person1) {
                        var formData = {
                            sender: sender.username,
                            senderAva: sender.avatar,
                            receiver: data1[0].person1,
                            receiverAva: data1[0].person1ID.avatar,

                        }
                    }
                    if (sender.username != data1[0].person2) {
                        var formData = {
                            sender: sender.username,
                            senderAva: sender.avatar,
                            receiver: data1[0].person2,
                            receiverAva: data1[0].person2ID.avatar,

                        }
                    }
                    res.render("message/chatBoxHistory.ejs", { data1, formData })
                }
            })
        });
    }

    getMessenger(req, res) {
        chatModel.find({ _id: req.query._idRoom }).populate('person1ID', { avatar: 1 }).populate('person2ID', { avatar: 1 }).exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }


    addChat(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        var receiver = req.body.receiver
        AccountModel.findOne({ username: receiver }, function(err, data) {
            if (err) {
                res.json({ msg: 'lỗi khi tìm kiếm user' });
            } else if (data) {
                AccountModel.findOne({ _id: decodeAccount }, function(err, sender) {
                    var sender = sender.username
                    if (sender != receiver) {
                        chatModel.find({ $or: [{ person1: sender, person2: receiver }, { person1: receiver, person2: sender }] }, function(err, data) {
                            if (err) {
                                res.json({ msg: 'error' });
                            } else if (data.length === 0) {
                                chatModel.create({
                                    person1: sender,
                                    person2: receiver,
                                    message: {
                                        ownermessenger: "Hệ thống",
                                        messContent: "Đã kết nối! Ấn vào để chat",
                                    }
                                }, function(err, data) {
                                    if (err) {
                                        res.json({ msg: 'có lỗi trogn khi tạo cuộc trò chuyện' });
                                    } else {
                                        var _idRoom = data._id
                                        res.json({ msg: 'tạo cuộc hội thoại thành công', sender, _idRoom, receiver });
                                    }
                                });
                            } else {
                                var _idRoom = data._id
                                res.json({ msg: 'cuộc hội thoại đã được tạo', sender, _idRoom, data, receiver });
                            }
                        });
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