const AccountModel = require('../models/account');
const ClassModel = require('../models/class');
const ProposalModel = require('../models/proposal');

const { JsonWebTokenError } = require('jsonwebtoken');
var jwt = require('jsonwebtoken');
class teacherController {
    teacherHome(req, res) {
        res.render('teacher/teacherHome')
    }

    teacherProfile(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.findOne({ _id: decodeAccount }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    allClass(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        ClassModel.find({ teacherID: decodeAccount }).exec((err, classInfor) => {
            res.render('teacher/allClass', { classInfor })
        })
    }




    allClassStudent(req, res) {
        var _id = req.query.abc
        ClassModel.find({ _id: _id }).populate('studentID.ID').exec((err, selectedClassInfor) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: selectedClassInfor });
            }
        })
    }

    addStudentToClass(req, res) {
        AccountModel.find({ role: 'student', routeName: req.query.routeName, stage: req.query.stage }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    doaddStudentToClass(req, res) {
        var classID = req.body.classID
        let studentID = req.body.studentlist
        AccountModel.updateMany({ _id: { $in: req.body.studentlistcl } }, { $push: { classID: req.body.classID } }, function(err, data) {
            if (err) {
                console.log("lỗi trong quá trình thêm lớp vào thông tin học sinh")
            } else {
                ClassModel.findOneAndUpdate({ _id: classID }, {
                    $push: {
                        studentID: {
                            $each: req.body.studentlist
                        }
                    }
                }, function(err, teacher) {
                    if (err) {
                        res.json({ msg: 'error' });
                    } else {
                        res.json({ msg: 'success' });
                    }
                })
            }
        })
    }

    doremoveStudentToClass(req, res) {
        var classID = req.body.classID
        AccountModel.updateMany({ _id: { $in: req.body.studentlistcl } }, { $pull: { classID: req.body.classID } }, function(err, data) {
            if (err) {
                console.log("lỗi trong quá trình xóa lớp trong thông tin học sinh")
            } else {
                ClassModel.updateMany({ _id: req.body.classID }, {
                    $pull: {
                        studentID: {
                            ID: { $in: req.body.studentlistcl }
                        }
                    }
                }, function(err, teacher) {
                    if (err) {
                        res.json({ msg: 'error' });
                    } else {
                        res.json({ msg: 'success' });
                    }
                })
            }
        })
    }

    studentAssessment(req, res) {
        ClassModel.findOneAndUpdate({ _id: req.body.classID, 'studentID.ID': req.body.studentId }, {
            $set: {
                "studentID.$.grade": req.body.grade,
                "studentID.$.feedBackContent": req.body.comment
            }
        }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success' });
            }
        })
    }

    allProposal(req, res) {
        console.log("vaof r")
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        ProposalModel.find({ teacherID: decodeAccount }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
            }
        })
    }

    extracurricularActivities(req, res) {
        res.json('Trang xem thông tin hoạt động ngoại khóa đã thực hiện và tiến hành đánh giá học sinh trong hoạt động ngoại khóa ')
    }

    uploadNewProposal(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        var proposalFile = req.body.file;
        var data = proposalFile.split(',')[1];
        var base64data = data.toString('base64')
        ProposalModel.create({
            proposalName: req.body.proposalName,
            Content: req.body.proposalContent,
            file: base64data,
            teacherID: decodeAccount
        }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success' });
            }
        })
    }

    allChat(req, res) {
        res.json('Tất cả những cuộc trò chuyện')
    }

    connectToChat(req, res) {
        res.json('chọn người để trò chuyện')
    }

    chatConversation(req, res) {
        res.json('Thực hiện cuộc trò chuyện')
    }


}
module.exports = new teacherController