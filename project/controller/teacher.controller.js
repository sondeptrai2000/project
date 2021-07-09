const AccountModel = require('../models/account');
const ClassModel = require('../models/class');
const extracurricularActivitiesModel = require('../models/extracurricularActivities');
var fs = require('fs')

const { JsonWebTokenError } = require('jsonwebtoken');
var jwt = require('jsonwebtoken');


const { google } = require("googleapis");
const classModel = require('../models/class');
const CLIENT_ID = "279772268126-bdo0c5g58jriuo7l057rdphld66t8cmj.apps.googleusercontent.com"
const CLIENT_SECRET = "4FHV8fvNK4ZLyfPBzi5SDs7a"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = "1//04hkstXaqmlvyCgYIARAAGAQSNwF-L9Irk7DfaT5oiNwsQdGnTolco5UEP96BNf-cSHjWGfXfbE9b5RVb_ieNd01P7oyahLOtTZY"

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})
class teacherController {
    teacherHome(req, res) {
        res.render('teacher/teacherHome')
    }

    teacherProfile(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        AccountModel.findOne({ _id: decodeAccount }).lean().exec(function(err, data) {
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
        ClassModel.find({ teacherID: decodeAccount }).lean().exec((err, classInfor) => {
            res.render('teacher/allClass', { classInfor })
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

    allActivityProposal(req, res) {
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        extracurricularActivitiesModel.find({ teacherID: decodeAccount }).populate({ path: 'classID', select: 'className' }).lean().sort({ uploadDate: -1 }).exec(function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
            }
        })
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
            const response = await drive.files.create({
                requestBody: {
                    name: req.body.filename, //đặt tên
                    parents: ['1evgjhxMA8DujwwkvMpaXIAqA_GigLJes'] //chọn file muốn lưu vào ở drive. Id của folder ở trên link url
                },
                media: {
                    body: fs.createReadStream(path),
                },
            });
            fs.unlinkSync(path)
                // console.log(response.data.id);
            await drive.permissions.create({
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
        let token = req.cookies.token
        let decodeAccount = jwt.verify(token, 'minhson')
        extracurricularActivitiesModel.create({
            fileLink: fileLink,
            classID: req.body.classID,
            teacherID: decodeAccount
        }, function(err, data) {
            if (err) {
                res.json({ msg: 'error' });
            } else {
                res.json({ msg: 'success', data });
            }
        })
    }

    async updateProposal(req, res) {
            console.log("vào")
            var path = __dirname.replace("controller", "public/outDoorActivity") + '/' + req.body.filename;
            var image = req.body.file;
            var data = image.split(',')[1];
            fs.writeFileSync(path, data, { encoding: 'base64' });
            var temp = fs.readFileSync(path);
            var buff = new Buffer(temp);
            var base64data = buff.toString('base64');
            try {
                const response = await drive.files.create({
                    requestBody: {
                        name: req.body.filename, //đặt tên
                        parents: ['1evgjhxMA8DujwwkvMpaXIAqA_GigLJes'] //chọn file muốn lưu vào ở drive. Id của folder ở trên link url
                    },
                    media: {
                        body: fs.createReadStream(path),
                    },
                });

                // console.log(response.data.id);
                await drive.permissions.create({
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
            let token = req.cookies.token
            let decodeAccount = jwt.verify(token, 'minhson')
            extracurricularActivitiesModel.findOneAndUpdate({ _id: req.body.id }, { fileLink: fileLink }).lean().sort({ uploadDate: -1 }).exec(function(err, data) {
                if (err) {
                    res.json({ msg: 'error' });
                } else {
                    res.json({ msg: 'success', data });
                }
            })
        }
        // updateProposal(req, res) {
        // if (req.body.file == "none") {
        //     var update = {
        //         proposalName: req.body.proposalName,
        //         Content: req.body.Content,
        //         proposalType: req.body.proposalType,
        //         uploadDate: new Date
        //     }
        // } else {
        //     var update = {
        //         proposalName: req.body.proposalName,
        //         Content: req.body.Content,
        //         file: req.body.file,
        //         proposalType: req.body.proposalType,
        //         uploadDate: new Date
        //     }
        // }

    // }

    async deleteProposal(req, res) {
        try {
            extracurricularActivitiesModel.findOne({ _id: req.body.id }, function(err, data) {
                if (err) {
                    res.json({ msg: 'error' });
                } else {
                    var idfile = data.fileLink.replace("https://docs.google.com/file/d/", "")
                    idfile = idfile.replace("/preview", "")
                    const response = drive.files.delete({
                        fileId: idfile,
                    });
                }
            })

        } catch (error) {
            console.log(error.message);
        }
        extracurricularActivitiesModel.deleteOne({ _id: req.body.id }, function(err, data) {
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