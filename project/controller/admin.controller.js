const AccountModel = require('../models/account');
const studyRouteModel = require('../models/studyRoute');
const ClassModel = require('../models/class');
const consultingInformationModel = require('../models/consultingInformation');
const assignRoomAndTimeModel = require('../models/assignRoomAndTime');

const fs = require("fs")
const { google } = require("googleapis")
var path = require('path');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const chatModel = require('../models/messenger');

const { data } = require('jquery');
const { inflate } = require('zlib');
const nodemailer = require('nodemailer');

//set up kết nối tới ggdrive
const KEYFILEPATH = path.join(__dirname, 'service_account.json')
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth(
    opts = { keyFile: KEYFILEPATH, scopes: SCOPES }
);
const driveService = google.drive(options = { version: 'v3', auth });

// set up mail sever
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: 'sownenglishedu@gmail.com', pass: 'son123@123' },
    tls: { rejectUnauthorized: false }
});

//thực hiện upflie lên ggdrive và trả về ID của file đó trên drive
async function uploadFile(name, rootID, path) {
    var id = []
    id.push(rootID);
    //upload file to drive
    var responese = await driveService.files.create(param = {
        resource: { "name": name, "parents": id },
        media: { body: fs.createReadStream(path = path) },
    });
    //tạo quyền truy cập (xem ) cho file vừa upload
    await driveService.permissions.create({
        fileId: responese.data.id,
        requestBody: { role: 'reader', type: 'anyone', },
    });
    //trả về id của file đó trên drive để lưu vào mongoDB
    return responese.data.id
}
class adminController {
    async adminHome(req, res) {
        // AccountModel.updateMany({}, { $set: { classID: [] } }, function(err, data) {
        //         if (err) {
        //             console.log("k ok")
        //         } else {
        //             console.log(" ok")
        //         }
        //     })
        assignRoomAndTimeModel.updateMany({}, {
                $set: { room: [] }
            }, function(err, data) {
                if (err) {
                    console.log("k ok 2")
                } else {
                    console.log(" ok 2 ")
                }
            })
            // res.render('admin/adminHome')
            // await chatModel.updateMany({
            //     read: []
            // })
            // console.log("ok")
    }

    async assignRoomAndTime(req, res) {
        try {
            res.render('admin/assignRoomAndTime')
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }

    async getRoomAndTime(req, res) {
        try {
            console.log("vào")
            var data = await assignRoomAndTimeModel.find({})
            res.json({ msg: 'success', data });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }

    async addRoom(req, res) {
        try {
            await assignRoomAndTimeModel.updateMany({}, { $push: { room: { $each: req.body.roomName }, listRoom: req.body.room } })
            res.json({ msg: 'success' });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }

    async deleteRoom(req, res) {
        try {
            var list = req.body.listRoom
            console.log(list)
            list.forEach(async(e) => {
                await assignRoomAndTimeModel.updateMany({}, { $pull: { room: { room: e }, listRoom: e } })
            })
            res.json({ msg: 'success' });

        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }

    async deleteClass(req, res) {
        try {
            //lấy thông tin lớp học
            var classInfor = await ClassModel.findOne({ _id: req.query.id });
            //lấy danh sách và tiến hành xóa lớp trong thông tin cá nhân của học sinh
            //Note: cần xóa cả ở trong lộ trình học cá nhân của học sinh
            var listStudentID = [];
            if (classInfor.studentID.length != 0) {;
                classInfor.studentID.forEach((e) => { listStudentID.push(e.ID) })
                await AccountModel.updateMany({ _id: { $in: listStudentID } }, { $pull: { classID: req.query.id } });
            }
            await ClassModel.deleteOne({ _id: req.query.id })
            res.json({ msg: 'success', data });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //lấy các ca học trong thứ mà người dùng yêu cầu
    async getThu(req, res) {
        try {
            var dayOfWeek = '0' + req.query.dayOfWeek
            var data = await assignRoomAndTimeModel.find({ dayOfWeek })
            res.json({ msg: 'success', data });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //lấy các lich học của các lớp mà giao viên đang giảng dạy để tìm thời gian trống. Có thể dạy các lớp khác
    async getTime(req, res) {
        try {
            var data = await ClassModel.find({ teacherID: req.query.teacherID, classStatus: "Processing" }, { schedule: { $elemMatch: { day: '0' + req.query.dayOfWeek } } }, { schedule: 1 })
            res.json({ msg: 'success', data });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //cập nhật lịch học của 1 lớp nào đó
    async doupdateSchedule(req, res) {
        try {
            var oldSchuedule = req.body.old;
            var update = req.body.update;
            //format date
            update["schedule.$.date"] = new Date(req.body.date);
            //cập nhật lịch học mới ở bảng class
            await ClassModel.updateOne({ _id: req.body.classID, "schedule._id": req.body.scheduleID }, { $set: update });
            //cập nhật trạng thái phòng của lịch mới
            await assignRoomAndTimeModel.updateOne({ dayOfWeek: update['schedule.$.day'], room: { $elemMatch: { room: update['schedule.$.room'], time: update['schedule.$.time'] } } }, { $set: { "room.$.status": "Ok" } });
            //lấy danh sách học lịch trong lớp để tiến hành gửi mail thông báo về sự thay đổi
            var getListEmail = await ClassModel.find({ _id: req.body.classID }, { "studentID.ID": 1, className: 1 }).populate({ path: 'studentID.ID', select: 'email' }).lean();
            var listEmail = "";
            //lấy danh sách các mail của học sinh để thông báo về sự thay đổi
            getListEmail[0].studentID.forEach(element => { listEmail = listEmail + element.ID.email + ', ' });
            listEmail.slice(0, -2);
            var content = 'Do 1 số vấn đề giáo viên, buổi học của lớp ' + getListEmail[0].className + ' vào ngày ' + oldSchuedule[0] + ' từ ' + oldSchuedule[3] + " chuyển sang ngày " + update['schedule.$.date'] + ' từ ' + update['schedule.$.time'] + '.';
            var mainOptions = { from: 'sownenglishedu@gmail.com', to: listEmail, subject: 'Notification', text: content };
            await transporter.sendMail(mainOptions);
            res.json({ msg: 'success' });
        } catch (e) {    
            console.log(e)
            res.json({ msg: 'error' });
        }
    }



    //đếm số lượng account dựa trên role
    async countAccount(req, res) {
        try {
            console.log("countAccount")
            var A = new Date()
                //số tài khoản hiển thị trên 1 trang
            var accountPerPage = 10
            var numberOfAccount = await AccountModel.find({ role: req.query.role }, { role: 1 }).lean().countDocuments()
            var soTrang = numberOfAccount / accountPerPage + 1
            var B = new Date()
            console.log(B - A)
            res.json({ msg: 'success', soTrang, numberOfAccount });
        } catch (e) {    
            console.log(e)
            res.json({ msg: 'error' });
        }
    }

    //đếm số lượng account dựa trên trạng thái của lớp học
    async countClass(req, res) {
        try {
            console.log("countClass")
            var A = new Date()
                //số lớp hiển thị trên 1 trang
            var classPerPage = 2
            var numberOfClass = await ClassModel.find({ classStatus: req.query.status }, { _id: 1 }).lean().countDocuments()
            console.log(req.query.status)
            console.log(numberOfClass)
            var soTrang = numberOfClass / classPerPage + 1
            var B = new Date()
            console.log(B - A)
            res.json({ msg: 'success', soTrang, numberOfClass });
        } catch (e) {    
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //lấy tất cả cacs lớp đang hoạt động
    //Note: Chỉnh thành số trang
    async getAllClass(req, res) {
        try {
            var A = new Date()
            var classPerPage = 2
            var skip = classPerPage * parseInt(req.query.page)
            var classInfor = await ClassModel.find({ classStatus: req.query.status }, { schedule: 0, studentID: 0, classStatus: 0 }).populate({ path: "teacherID", select: "username email phone" }).skip(skip).limit(classPerPage).lean();
            var B = new Date()
            console.log(B - A)
            res.json({ msg: 'success', classInfor });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //lấy account ở trang ?
    async getAccount(req, res) {
        try {
            console.log("getAccount")
            var A = new Date()
                //số tài khoản hiển thị trên 1 trang
            var accountPerPage = 10
            var skip = accountPerPage * parseInt(req.query.sotrang)
            var data = await AccountModel.find({ role: req.query.role }, { classID: 0, progess: 0, codeRefresh: 0, chat: 0, password: 0 }).skip(skip).limit(accountPerPage).lean()
            var B = new Date()
            console.log(B - A)
            res.json({ msg: 'success', data });
        } catch (e) {    
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //trang xem thông tin cụ thể thông tin quá trình học của học sinh 
    async studentClass(req, res) {
        try {
            var data = await AccountModel.findOne({ _id: req.params.id }).populate({ path: 'classID', populate: { path: 'teacherID', select: 'username' } }).lean()
            res.render('admin/studentClassDetail', { data: [data] })
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //tìm kiếm thông tin account và hiển thị ra form bên phải
    async search(req, res) {
        try {
            var condition = req.query.condition
            var data = await AccountModel.findOne(condition).populate("relationship").lean()
            if (!data) res.json({ msg: 'none' });
            if (data) res.json({ msg: 'success', data });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };

    async createAccount(req, res) {
            try {
                res.render('admin/createAccount')
            } catch (e) {
                console.log(e)
                res.json({ msg: 'error' });
            }
        }
        //lấy tên các lộ trình học
    async getRoute(req, res) {
        try {
            var data = await studyRouteModel.find({}, { routeName: 1 }).lean()
            res.json({ msg: 'success', data });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //lấy các mốc giai đoạn của lộ trình đã chọn 
    async getStage(req, res) {
        try {
            var data = await studyRouteModel.find({ routeName: req.query.abc }).lean()
            res.json({ msg: 'success', data });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //lấy các học sinh đang học tình trạng học tập tại mức độ đã chọn để thêm vào lớp trong form tạo lớp
    async getStudent(req, res) {
        try {
            console.log(req.query.time)
            var student = await AccountModel.find({ role: 'student', routeName: req.query.abc, stage: req.query.levelS, availableTime: { $in: [req.query.time, 'All'] } }).lean()
            res.json({ msg: 'success', student });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }

    async createRoute(req, res) {
        try {
            res.render('admin/createRoute')
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //hiển thị tất cả các lộ trình trong manage route page
    async getAllRoute(req, res) {
        try {
            var data = await studyRouteModel.find({}, { _id: 1, routeName: 1, description: 1 }).lean()
            res.json({ msg: 'success', data })
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };

    //xem các lịch trình giảng dạy của 1 lộ trình học
    async viewSchedule(req, res) {
        try {
            var data = await studyRouteModel.find({ _id: req.query._id }).lean()
            res.json({ msg: 'success', data });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //tạo 1 lộ trình mới
    async docreateRoute(req, res) {
        try {
            await studyRouteModel.create({ routeName: req.body.routeName, description: req.body.description, routeSchedual: req.body.schedule })
            res.json({ msg: 'success' })
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }


    async searchRoute(req, res) {
        // try {
        //     console.log(req.query.name)
        //     await studyRouteModel.find({ $text: { $search: "coffee" } } { routeName: { $regex: "/^doanh/" } })
        //     res.json({ msg: 'success' })
        // } catch (e) {
        //     console.log(e)
        //     res.json({ msg: 'error' });
        // }
    };
    //cập nhật lộ trình học
    async doUpdateRoute(req, res) {
        try {
            await studyRouteModel.findOneAndUpdate({ _id: req.body.id }, { routeName: req.body.routeName, description: req.body.description, routeSchedual: req.body.schedule, })
            res.json({ msg: 'success' })
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //xóa lộ trình học 
    async deleteRoute(req, res) {
        try {
            await studyRouteModel.deleteOne({ _id: req.body.id })
            res.json({ msg: 'success' });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }

    //tạo tk mới
    async doCreateAccount(req, res) {
        try {
            //check sdt và email xem có trùng không
            var check = await AccountModel.find({ email: req.body.student.email }).lean()
            var check1 = await AccountModel.find({ email: req.body.phuhuynh.email }).lean()
            var checkphone = await AccountModel.find({ phone: req.body.student.phone }).lean()
            var checkphone1 = await AccountModel.find({ phone: req.body.phuhuynh.phone }).lean()
            if (check.length != 0 || check1.length != 0) {
                res.json({ msg: 'Account already exists' })
            } else if (checkphone.length != 0 || checkphone1.length != 0) {
                res.json({ msg: 'Phone already exists' })
            } else {
                //tiến hành ghi file ảnh upload lên drive và định dạng dữ liệu
                var path = __dirname.replace("controller", "public/avatar") + '/' + req.body.filename;
                var image = req.body.file;
                var data = image.split(',')[1];
                fs.writeFileSync(path, data, { encoding: 'base64' });
                var response = await uploadFile(req.body.filename, "11B3Y7b7OJcbuqlaHPJKrsR2ow3ooKJv1", path)
                var fileLink = "https://drive.google.com/uc?export=view&id=" + response
                var student = req.body.student
                var phuhuynh = req.body.phuhuynh
                var role = student.role
                var password = req.body.password
                var password2 = req.body.password + "@123"
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(password, salt);
                const hash2 = bcrypt.hashSync(password2, salt);
                student["avatar"] = fileLink
                student["password"] = hash
                phuhuynh["password"] = hash2
                if (role === "teacher") await AccountModel.create(student)
                if (role === "student") {
                    //nếu là học sinh thì sẽ cập nhật thông tin phụ huynh 
                    var studentAcc = await AccountModel.create(student)
                    phuhuynh["relationship"] = studentAcc._id
                    var guardianAcc = await AccountModel.create(phuhuynh)
                    var relationship = guardianAcc._id
                    var studentAcc = await AccountModel.findOneAndUpdate({ _id: studentAcc._id }, { relationship: relationship, $push: { progess: { stage: student.stage, stageClass: [{ classID: "", name: "", status: "Pass" }] } } })
                }
            }
            res.json({ msg: 'success' });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }

    //lấy thông tin học sinh để hiển thị chọn học sinh vào lớp
    async addStudentToClass(req, res) {
        try {
            var condition = req.query.condition
            var data = await AccountModel.find(condition, { avatar: 1, username: 1, subject: 1, routeName: 1, stage: 1, email: 1, classID: 1, progess: 1 }).lean();
            res.json({ msg: 'success', data: data });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    }
    async doaddStudentToClass(req, res) {
        try {
            //lấy dữ liệu của lớp
            var data = await ClassModel.findOne({ _id: req.body.classID }).lean();
            //thêm classID vào bảng thông tin của các học sinh
            await AccountModel.updateMany({ _id: { $in: req.body.studentlistcl } }, { $push: { classID: req.body.classID } });
            //thêm classID vào bảng thông tin lộ trình của các học sinh ( progess)
            await AccountModel.updateMany({ _id: { $in: req.body.studentlistcl }, "progess.stage": data.stage }, { $push: { "progess.$.stageClass": { classID: data._id, name: data.subject, status: "studying" } } });
            //Thêm học sinh vào danh sách học sinh trong bảng thông tin lớp
            await ClassModel.findOneAndUpdate({ _id: req.body.classID }, { $push: { studentID: { $each: req.body.studentlist }, } });
            //thêm trong danh sáhc điểm danh
            await ClassModel.updateOne({ _id: req.body.classID }, { $push: { "schedule.$[].attend": { $each: req.body.studentlistAttend } } });
            res.json({ msg: 'success' });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //xóa 1 học sinh ra khoeir lớp
    async doremoveStudentToClass(req, res) {
        try {
            //xóa classID vào bảng thông tin của các học sinh
            await AccountModel.updateMany({ _id: { $in: req.body.studentlistcl } }, { $pull: { classID: req.body.classID } });
            //xóa classID vào bảng thông tin lộ trình của các học sinh ( progess)
            await AccountModel.updateMany({ _id: { $in: req.body.studentlistcl }, "progess.stageClass.classID": req.body.classID }, {
                $pull: { "progess.$.stageClass": { classID: req.body.classID } }
            });
            //xóa học sinh vào danh sách học sinh trong bảng thông tin lớp
            await ClassModel.findOneAndUpdate({ _id: req.body.classID }, { $pull: { studentID: { ID: { $in: req.body.studentlistcl } } } });
            //xóa trong danh sáhc điểm danh
            await ClassModel.updateOne({ _id: req.body.classID }, { $pull: { "schedule.$[].attend": { studentID: { $in: req.body.studentlistcl } } } });
            res.json({ msg: 'success' });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //hiển thị danh sách lịch học
    async attendedList(req, res) {
        try {
            var data = await ClassModel.find({ _id: req.query.id }, { "schedule.date": 1, "schedule._id": 1, "schedule.day": 1, "schedule.room": 1, "schedule.status": 1, "schedule.time": 1 }).lean();
            res.json({ msg: 'success', data: data });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //lấy thông tin 1 lõ trình học
    async editAccount(req, res) {
        try {
            var targetxxx = await studyRouteModel.find({}).lean()
            res.json({ msg: 'success', targetxxx });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };

    // cập nhật thông tin tài khoản
    async doeditAccount(req, res) {
        try {
            var check = await AccountModel.find({ email: req.body.formData1.email }).lean()
            var checkphone = await AccountModel.find({ phone: req.body.formData1.phone }).lean()
            if (check.length > 1) {
                res.json({ msg: 'Account already exists' })
            } else if (checkphone.length > 1) {
                res.json({ msg: 'Phone already exists' })
            } else {
                var password = req.body.password
                var password1 = req.body.password + "@123"
                var formData1 = req.body.formData1
                var formData2 = req.body.formData2
                if (password.length != 0) {
                    const salt = bcrypt.genSaltSync(saltRounds);
                    const hash = bcrypt.hashSync(password, salt);
                    const salt1 = bcrypt.genSaltSync(saltRounds);
                    const hash1 = bcrypt.hashSync(password1, salt);
                    formData1["password"] = hash
                    formData2["password"] = hash1
                }
                if (req.body.file != "none") {
                    var path = __dirname.replace("controller", "public/avatar") + '/' + req.body.filename;
                    var image = req.body.file;
                    var data = image.split(',')[1];
                    fs.writeFileSync(path, data, { encoding: 'base64' });
                    var response = await uploadFile(req.body.filename, "11B3Y7b7OJcbuqlaHPJKrsR2ow3ooKJv1", path)
                    if (!response) res.json({ msg: 'error' });
                    formData1["avatar"] = "https://drive.google.com/uc?export=view&id=" + response
                    var oldImg = req.body.oldLink
                    oldImg = oldImg.split("https://drive.google.com/uc?export=view&id=")[1]
                    await driveService.files.delete({ fileId: oldImg })
                } else {
                    formData1["avatar"] = req.body.oldLink
                }
                if (formData1.role == "teacher") {
                    await AccountModel.findOneAndUpdate({ _id: req.body.id }, formData1)
                } else {
                    await AccountModel.findOneAndUpdate({ _id: req.body.id }, formData1)
                    await AccountModel.findOneAndUpdate({ relationship: req.body.id }, formData2)
                }
                res.json({ msg: 'success', data: data });
            }
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };

    async createClass(req, res) {
        try {
            res.render('admin/createClass')
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };
    //mở form tạo class và lấy thông tin của giáo viên và các khóa học đẻe chọn giaos viên và lộ trình của lớp
    async getTeacherAndClass(req, res) {
        try {
            var a = new Date()
            var targetxxx = await studyRouteModel.find({}, { routeName: 1 }).lean()
            var teacher = await AccountModel.find({ role: 'teacher' }, { avatar: 1, email: 1 }).lean()
            console.log("get teacher and route: ", (new Date() - a))
            res.json({ msg: 'success', teacher, targetxxx });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };

    //tạo lớp
    async docreateClass(req, res) {
        try {
            var studentID = req.body.studentID
            var listStudent = req.body.listStudent
            var data = await ClassModel.create({
                className: req.body.className,
                subject: req.body.subject,
                routeName: req.body.routeName,
                stage: req.body.stage,
                description: req.body.description,
                teacherID: req.body.teacherID,
                endDate: new Date(req.body.endDate),
                startDate: new Date(req.body.startDate),
                timeToStudy: req.body.timeToStudy
            });
            //nếu có học sinh
            if (studentID && listStudent) {
                //thêm classID vào thông tin học sinh
                await AccountModel.updateMany({ _id: { $in: studentID } }, { $push: { classID: data._id } });
                //thêm classID vào lộ trình của thông tin học sinh
                await AccountModel.updateMany({ _id: { $in: studentID }, "progess.stage": req.body.stage }, { $push: { "progess.$.stageClass": { classID: data._id, name: req.body.subject, status: "studying" } } });
                //cập nhật thông tin về danh sáhc học sinh, lịch học vòa lớp
                await ClassModel.findOneAndUpdate({ _id: data._id }, {
                    $push: { studentID: { $each: listStudent }, StudentIDoutdoor: { $each: listStudent }, schedule: { $each: req.body.schedual } }
                });
            }
            //cập nhật trạng thái cho phòng thành none (đã có lớp dạy)
            for (var i = 0; i < req.body.time.length; i++) {
                var dayOfWeek = '0' + req.body.buoihoc[i]
                await assignRoomAndTimeModel.updateOne({ dayOfWeek: dayOfWeek, room: { $elemMatch: { room: req.body.room[i], time: req.body.time[i] } } }, { $set: { "room.$.status": "Ok" } })
            }
            res.json({ msg: 'success' });
        } catch (error) {
            console.log(err)
            res.json({ msg: 'error' });
        }
    };
    //tìm kiếm 1 lớp học
    async searchClass(req, res) {
        try {
            console.log(req.query.className)
            var classInfor = await ClassModel.find({ className: req.query.className }).lean();
            if (!classInfor) res.json({ msg: 'notFound' });
            if (classInfor) res.json({ msg: 'success', classInfor });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };


    // async allClassLevel(req, res) {
    //     try {
    //         var classInfor = await ClassModel.find({}).populate('studentID').populate('teacherID').lean()
    //         res.render('admin/allClassLevel.hbs', { classInfor })
    //     } catch (error) {
    //         console.log(err)
    //         res.json({ msg: 'error' });
    //     }
    // }


    //lấy danh sách các học sinh trong lớp
    async allClassStudent(req, res) {
        try {
            var a = new Date()
            var _id = req.query.abc;
            var selectedClassInfor = await ClassModel.find({ _id: _id }, { 'studentID.ID': 1 }).populate('studentID.ID', { avatar: 1, username: 1, aim: 1, email: 1 }).lean();
            console.log("getListStudent: ", (new Date() - a))
            res.json({ msg: 'success', data: selectedClassInfor });
        } catch (e) {
            console.log(e)
            res.json({ msg: 'error' });
        }
    };




    async consultingAll(req, res) {
        try {
            var month = req.query.month
            var data = await consultingInformationModel.find({ signTime: { $gt: req.query.start, $lt: req.query.end } }).lean()
            res.json({ msg: 'success', data, month });
        } catch (error) {
            console.log(err)
            res.json({ msg: 'error' });
        }
    }
}

module.exports = new adminController