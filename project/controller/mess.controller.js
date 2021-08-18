const AccountModel = require('../models/account')
const ClassModel = require('../models/class');
const chatModel = require('../models/messenger');

const { data, param, css } = require('jquery')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt');
const mongodb = require("mongodb");
const sizeof = require('object-sizeof');

class messtController {
    //ấn chat vào người bất kỳ r dẫn đến form chat và lịch sử
    async makeConnection(req, res, next) {
        try {
            let token = req.cookies.token
            let decodeAccount = jwt.verify(token, 'minhson')
            var sender = await AccountModel.findOne({ _id: decodeAccount }, { username: 1, avatar: 1, chat: 1 }).lean()
            if (sender)
                var receiver = await AccountModel.findOne({ username: req.body.studentName }, { avatar: 1, chat: 1 }).lean()
            if (receiver)
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
                var data = await chatModel.create(createConnection)
                await AccountModel.updateMany({ username: { $in: [senderName, receiverName] } }, { $push: { chat: data._id } })
                next();
            } else {
                next();
            }
        } catch (e) {
            if (!receiver) res.json({ msg: 'user not found' })
            if (!sender) res.json({ msg: 'user not found' })
        }
    }

    async chatForm(req, res) {
        try {
            let token = req.cookies.token
            let decodeAccount = jwt.verify(token, 'minhson')
            var sender = await AccountModel.findOne({ _id: decodeAccount }, { username: 1, chat: 1 }).lean()
            var data1 = await chatModel.find({ _id: { $in: sender.chat } }, {
                // lấy tin nhắn cuối cùng trong mảng message
                message: { $slice: -1 },
            }).sort({ updateTime: -1 }).lean()
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
                var data = await chatModel.findOne({ _id: data1[0]._id }, { message: 1 }).lean()
                res.render("message/chatBoxHistory.ejs", { data1, data, formData, listID })
            }
        } catch (e) {    
            if (e) {
                res.json('error')
            }
        }
    }

    getMessenger(req, res) {
        chatModel.findOne({ _id: req.query._idRoom }).lean().exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
            }
        })
    }


    async addChat(req, res) {
        try {
            var receiverName = req.body.receiver
            var data = await AccountModel.findOne({ username: receiverName }, { username: 1, avatar: 1, chat: 1 }).lean()
            if (data)
                var receiverAva = data.avatar
            let token = req.cookies.token
            let decodeAccount = jwt.verify(token, 'minhson')
            var sender = await AccountModel.findOne({ _id: decodeAccount }, { username: 1, avatar: 1, chat: 1 }).lean()
            if (sender)
                var senderName = sender.username
            var senderAva = sender.avatar
            var person1ListChat = sender.chat
            var person2ListChat = data.chat
            var check = false
            var _id
            for (var i = 0; i < person1ListChat.length; i++) {
                for (var u = 0; u < person2ListChat.length; u++) {
                    if (person1ListChat[i] == person2ListChat[u]) {
                        _id = person1ListChat[i]
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
                var data = await chatModel.create(createConnection)
                await AccountModel.updateMany({ username: { $in: [senderName, receiverName] } }, { $push: { chat: data._id } })
                var _idRoom = data._id
                res.json({ msg: 'tạo cuộc hội thoại thành công', senderName, _idRoom, receiverName, senderAva, receiverAva });
            } else {
                chatModel.findOne({ _id: _id }).lean().exec(function(err, data) {
                    if (err) {
                        res.json({ msg: 'error' });
                    } else {
                        res.json({ msg: 'cuộc hội thoại đã được tạo', senderName, data, receiverName, senderAva, receiverAva });
                    }
                })
            }
        } catch (error) {
            if (!data) res.json({ msg: 'user not found' })
            if (!sender) res.json({ msg: 'user not found' })
        }
    }
}

module.exports = new messtController;