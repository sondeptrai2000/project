const AccountModel = require('../models/account');
const ClassModel = require('../models/class');
const extracurricularActivitiesModel = require('../models/extracurricularActivities');
const eventModel = require('../models/event');

const { JsonWebTokenError } = require('jsonwebtoken');
var jwt = require('jsonwebtoken');


const fs = require("fs")
const readline = require("readline")
const { google } = require("googleapis")
var path = require('path');

//setup kết nối tới ggdrive
const KEYFILEPATH = path.join(__dirname, 'service_account.json')
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth(
    opts = {
        keyFile: KEYFILEPATH,
        scopes: SCOPES
    }
);
const driveService = google.drive(options = { version: 'v3', auth });

function dateNow() {
    var date = new Date()
    var month = date.getMonth() + 1
    var lol = date.getFullYear() + "-" + month + "-" + date.getDate()
    return lol
}

class teacherController {
    teacherHome(req, res) {
        res.render('teacher/teacherHome')
    }

    teacherProfile(req, res) {
        var token = req.cookies.token
        var decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.findOne({ _id: decodeAccount }).lean().exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    allClass(req, res) {
        var token = req.cookies.token
        var decodeAccount = jwt.verify(token, 'minhson')
        ClassModel.find({ teacherID: decodeAccount }, { StudentIDoutdoor: 0 }).lean().exec((err, classInfor) => {
            res.render('teacher/allClass', { classInfor })
        })
    }

    attendedOutDoor(req, res) {
        ClassModel.find({ _id: req.query.id }, { StudentIDoutdoor: 1 }).populate({ path: "StudentIDoutdoor.ID", select: "username avatar" }).lean().exec((err, data) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    takeAttendOutDoor(req, res) {
        ClassModel.findOneAndUpdate({ _id: req.body.id }, {
            $set: {
                StudentIDoutdoor: req.body.atended
            }
        }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success' });
            }
        })
    }



    allClassStudent(req, res) {
        var _id = req.query.abc
        ClassModel.find({ _id: _id }).populate('studentID.ID', { avatar: 1, username: 1, aim: 1, email: 1 }).lean().exec((err, selectedClassInfor) => {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: selectedClassInfor });
            }
        })
    }

    addStudentToClass(req, res) {
        AccountModel.find({
            role: 'student',
            routeName: req.query.routeName,
            stage: req.query.stage,
        }, { avatar: 1, username: 1, routeName: 1, stage: 1, email: 1, classID: 1 }).lean().exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data: data });
            }
        })
    }

    doaddStudentToClass(req, res) {
        var classID = req.body.classID
        var studentID = req.body.studentlist
        AccountModel.updateMany({ _id: { $in: req.body.studentlistcl } }, { $push: { classID: req.body.classID } }, function(err, data) {
            if (err) {
                console.log("lỗi trong quá trình thêm lớp vào thông tin học sinh")
            } else {
                ClassModel.findOneAndUpdate({ _id: classID }, {
                    $push: {
                        studentID: {
                            $each: req.body.studentlist
                        },
                        StudentIDoutdoor: {
                            $each: req.body.studentlist
                        }
                    }
                }).lean().exec(function(err, teacher) {
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
                        },
                        StudentIDoutdoor: {
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
                res.json({ msg: 'success', data });
            }
        })
    }

    allProposal(req, res) {

    }

    extracurricularActivities(req, res) {
        res.json('Trang xem thông tin hoạt động ngoại khóa đã thực hiện và tiến hành đánh giá học sinh trong hoạt động ngoại khóa ')
    }



    async uploadNewProposal(req, res) {
        var path = __dirname.replace("controller", "public/outDoorActivity") + '/' + req.body.filename;
        var image = req.body.file;
        var data = image.split(',')[1];
        fs.writeFileSync(path, data, { encoding: 'base64' });
        var temp = fs.readFileSync(path);
        var buff = new Buffer(temp);
        var base64data = buff.toString('base64');
        try {
            var responese = await driveService.files.create(param = {
                resource: {
                    "name": req.body.filename,
                    "parents": ["1evgjhxMA8DujwwkvMpaXIAqA_GigLJes"]
                },
                media: {
                    body: fs.createReadStream(path = path)
                },
            })
            await driveService.permissions.create({
                fileId: responese.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
            fs.unlinkSync(path)
            var fileLink = "https://docs.google.com/file/d/" + response.data.id + "/preview"
        } catch (error) {
            console.log(error.message);
        }
        ClassModel.findOneAndUpdate({ _id: req.body.classID }, { fileLink: fileLink, uploadDate: dateNow(), extracurricularActivitiesContent: req.body.content }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success' });
            }
        })
    }

    async deleteProposal(req, res) {
        try {
            ClassModel.findOne({ _id: req.body.id }, function(err, data) {
                if (err) {
                    res.json({ msg: 'error' });
                } else {
                    var idfile = data.fileLink.replace("https://docs.google.com/file/d/", "")
                    idfile = idfile.replace("/preview", "")
                    var responese = driveService.files.delete({
                        fileId: idfile,
                    })
                }
            })

        } catch (error) {
            console.log(error.message);
        }
        ClassModel.findOneAndUpdate({ _id: req.body.id }, { fileLink: "", uploadDate: "" }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success' });
            }
        })

    }

    allEvent(req, res) {
        var token = req.cookies.token
        var decodeAccount = jwt.verify(token, 'minhson')
        eventModel.find({}).lean().sort({ eventAt: -1 }).exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data, decodeAccount });
            }
        })
    }


    async updateProposalEvent(req, res) {
        var path = __dirname.replace("controller", "public/events") + '/' + req.body.filename;
        var image = req.body.file;
        var data = image.split(',')[1];
        fs.writeFileSync(path, data, { encoding: 'base64' });
        var temp = fs.readFileSync(path);
        var buff = new Buffer(temp);
        var base64data = buff.toString('base64');
        var folderID
        try {
            folderID = await eventModel.findOne({ _id: req.body._id }, { folderID: 1 }).lean()
        } catch (err) {
            res.json({ msg: 'error' });
        }
        try {
            const response = await driveService.files.create({
                requestBody: {
                    name: req.body.filename, //đặt tên
                    parents: [folderID.folderID] //chọn file muốn lưu vào ở drive. Id của folder ở trên link url
                },
                media: {
                    body: fs.createReadStream(path),
                },
            });
            // console.log(response.data.id);
            await driveService.permissions.create({
                fileId: response.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
            var fileLink = "https://docs.google.com/file/d/" + response.data.id + "/preview"
        } catch (error) {
            console.log(error.message);
        }
        var token = req.cookies.token
        var decodeAccount = jwt.verify(token, 'minhson')
        eventModel.findOneAndUpdate({ _id: req.body._id }, {
            $push: {
                proposals: {
                    teacherID: decodeAccount,
                    fileLink: fileLink,
                }
            }
        }).lean().sort({ uploadDate: -1 }).exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
            }
        })
    }


    async deleteProposalEvent(req, res) {
        var fileLink = req.body.fileLink
        fileLink = fileLink.replace("https://docs.google.com/file/d/", "")
        fileLink = fileLink.replace("/preview", "")
        try {
            var responese = await driveService.files.delete({
                fileId: fileLink,
            })
            console.log(responese.data, responese.status);
        } catch (error) {
            console.log(error.message);
        }
        var token = req.cookies.token
        var decodeAccount = jwt.verify(token, 'minhson')
        eventModel.findOneAndUpdate({ _id: req.body.id }, {
            $pull: {
                proposals: {
                    teacherID: decodeAccount,
                }
            }
        }).lean().sort({ uploadDate: -1 }).exec(function(err, data) {
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