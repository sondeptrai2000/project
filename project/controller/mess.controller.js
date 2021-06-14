const AccountModel = require('../models/account')
const ClassModel = require('../models/class');
const chatModel = require('../models/messenger');

const { data, param, css } = require('jquery')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt');
const mongodb = require("mongodb");

class messtController {
    makeConnection(req, res) {
        console.log("StudentID: " + req.query.studentID + " Name: " + req.query.studentName)
        console.log("TeacherID: " + req.query.teacherID + " Name: " + req.query.teacherName)
        chatModel.find({ person1: req.query.teacherName, person2: req.query.studentName }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else if (data.length == 0) {
                chatModel.create({
                    person1: req.query.teacherName,
                    person2: req.query.studentName
                }, function(err, data) {
                    if (err) {
                        res.json({ msg: 'có lỗi trogn khi tạo cuộc trò chuyện' });
                    } else {
                        res.json({ msg: 'tạo cuộc trò chuyện thành công', data: data });
                    }
                });
            } else {
                res.json({ msg: 'Bạn đã có kết nối với người này', data: data });
            }
        })

    }
}
module.exports = new messtController;