const { JsonWebTokenError } = require('jsonwebtoken');
const AccountModel = require('../models/account');
const ClassModel = require('../models/class');
var jwt = require('jsonwebtoken');
const fs = require("fs")
var path = require('path');
var bcrypt = require('bcrypt');
const saltRounds = 10;


class studentController {
    studentHome(req, res) {
        res.json('Trang chủ student')
    }



    async myAttended(req, res) {
        try {
            let token = req.cookies.token
            let decodeAccount = jwt.verify(token, 'minhson')
            console.log(req.query.classID)
            var data = await ClassModel.find({ _id: req.query.classID }, { schedule: 1, "studentID.absentRate": 1 }).populate({ path: "schedule.attend.studentID", select: { username: 1, avatar: 1 } }).lean();
            res.json({ msg: 'success', data: data, studentID: decodeAccount._id });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });

        }
    }

    allClass(req, res) {
        var params = req.params.id
        var studentName = req.cookies.username
        if (params != "0") res.render('student/allClass', { params, studentName })
        if (params == "0") res.render('student/allClass', { studentName })
    }


    async getClass(req, res) {
        try {
            let token = req.cookies.token
            let decodeAccount = jwt.verify(token, 'minhson')
            var classInfor = await AccountModel.find({ _id: decodeAccount._id }, { classID: 1 }).populate({
                path: 'classID',
                select: '-schedule',
                populate: {
                    path: 'teacherID',
                    select: 'username',
                }
            }).lean()
            res.json({ msg: 'success', classInfor, studentID: decodeAccount._id });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }


    getTeacherProfile(req, res) {
        AccountModel.find({ _id: req.query.abc }, { username: 1, email: 1, avatar: 1 }).lean().exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    allClassStudent(req, res) {
        var _id = req.query.abc
        ClassModel.find({ _id: _id }).populate('studentID.ID', { username: 1, email: 1, avatar: 1 }).lean().exec((err, selectedClassInfor) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: selectedClassInfor });
            }
        })
    }





    async getSchedule(req, res) {
        try {
            var token = req.cookies.token
            var decodeAccount = jwt.verify(token, 'minhson')
            var studentID = decodeAccount._id
                //lấy thời hiện tại để lấy khóa học đang hoạt động trong thời gian hiện tại. 
            var sosanh = new Date(req.query.dauTuan)
            var data = await AccountModel.findOne({ _id: decodeAccount }, { classID: 1 }).lean()
            var classInfor = await ClassModel.find({ _id: { $in: data.classID }, startDate: { $lte: new Date(req.query.dauTuan) }, endDate: { $gte: sosanh } }).lean()
            res.json({ msg: 'success', classInfor, studentID });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }





}
module.exports = new studentController