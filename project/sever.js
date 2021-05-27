const express = require("express");
const app = express();
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
var path = require('path');
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// var gridfs = require('gridfs-stream');
// var fs = require('fs');
// var mongoose = require('mongoose');

// /*
// 	Make a MongoDB connection
// */
// mongoose.connect('mongodb+srv://minhson123:minhson123@cluster0.v0phx.mongodb.net/project?retryWrites=true&w=majority')
// mongoose.Promise = global.Promise;

// gridfs.mongo = mongoose.mongo;
// /*
// 	Check MongoDB connection
// */
// var connection = mongoose.connection;
// connection.on('error', console.error.bind(console, 'connection error:'));

// connection.once('open', () => {

//     var gfs = gridfs(connection.db);

//     app.get('/', (req, res) => {
//         res.send('Download/Upload GridFS files to MongoDB - by grokonez.com');
//     });

//     // Upload a file from loca file-system to MongoDB
//     app.get('/api/file/upload', (req, res) => {

//         var filename = req.query.filename;

//         var writestream = gfs.createWriteStream({ filename: filename });
//         fs.createReadStream(__dirname + "/uploads/" + filename).pipe(writestream);
//         writestream.on('close', (file) => {
//             res.send('Stored File: ' + file.filename);
//         });
//     });

//     // Download a file from MongoDB - then save to local file-system
//     app.get('/api/file/download', (req, res) => {
//         // Check file exist on MongoDB

//         var filename = req.query.filename;

//         gfs.exist({ filename: filename }, (err, file) => {
//             if (err || !file) {
//                 res.status(404).send('File Not Found');
//                 return
//             }

//             var readstream = gfs.createReadStream({ filename: filename });
//             readstream.pipe(res);
//         });
//     });

//     // Delete a file from MongoDB
//     app.get('/api/file/delete', (req, res) => {

//         var filename = req.query.filename;

//         gfs.exist({ filename: filename }, (err, file) => {
//             if (err || !file) {
//                 res.status(404).send('File Not Found');
//                 return;
//             }

//             gfs.remove({ filename: filename }, (err) => {
//                 if (err) res.status(500).send(err);
//                 res.send('File Deleted');
//             });
//         });
//     });

//     // Get file information(File Meta Data) from MongoDB
//     app.get('/api/file/meta', (req, res) => {

//         var filename = req.query.filename;

//         gfs.exist({ filename: filename }, (err, file) => {
//             if (err || !file) {
//                 res.send('File Not Found');
//                 return;
//             }

//             gfs.files.find({ filename: filename }).toArray((err, files) => {
//                 if (err) res.send(err);
//                 res.json(files);
//             });
//         });
//     });
// });

app.set('views', './views');
app.set('view engine', 'hbs');
app.set('view-engine', 'ejs');
app.use(cookieParser())

app.get('/logout', function(req, res, next) {
    res.json('abc')
});
var pathh = path.resolve(__dirname, 'public');
app.use(express.static(pathh));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

//set the path of the jquery file to be used from the node_module jquery package  
app.use('/jquery', express.static(path.join(__dirname + '/node_modules/jquery/dist/')));

//set static folder(public) path  
app.use(express.static(path.join(__dirname + '/public')));

var index = require('./routes/index.route')
    // app.use('/', index);
    // var account = require('./routes/account.route')
    // app.use('/account', account);
var admin = require('./routes/admin.route')
app.use('/admin', admin);
var teacher = require('./routes/teacher.route')
app.use('/teacher', teacher);


//tiến hành cài đặt cho chat box
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
//real-time in chat
io.on("connection", (socket) => {
    socket.on("new_user_message", (data) => {
        socket.join(`${data.cookiesemail}and${data.user}`);
        socket.join(`${data.user}and${data.cookiesemail}`);
        var query1 = {
            userSend: data.cookiesemail,
            userReceive: data.user,
        }
        var query2 = {
            userSend: data.user,
            userReceive: data.cookiesemail,
        }

        // event listen client send text
        socket.on("client_send_mes", data => {
            socket.to(`${data.cookiesemail}and${data.User}`).to(`${data.User}and${data.cookiesemail}`).emit("server_send_mes", {
                message: data.mes,
                from: data.cookiesemail,
                Time_Mes: `${new Date().getHours()}:${new Date().getMinutes()}-${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,

            });

            MongoClient.connect('mongodb+srv://minhpham852000:Quangminh2000@cluster0.46ara.mongodb.net/test', (err, db) => {
                let dbo = db.db("test");
                dbo.collection("chats").updateOne(query1, {
                    "$push": {
                        message: {
                            check: 1,
                            Mes: `${data.mes}`,
                            index_time: new Date().valueOf(),
                            date: `${new Date().getHours()}:${new Date().getMinutes()}-${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,

                        }
                    }
                });
                dbo.collection("chats").updateOne(query2, {
                    "$push": {
                        message: {
                            check: 0,
                            Mes: `${data.mes}`,
                            index_time: new Date().valueOf(),
                            date: `${new Date().getHours()}:${new Date().getMinutes()}-${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,

                        }
                    }
                });
            });
        });
        socket.on("client_send_file_mes", (data) => {
            socket.to(`${data.cookiesemail}and${data.User}`).to(`${data.User}and${data.cookiesemail}`).emit("server_send_file_mes", {
                message: data.mes,
                from: data.cookiesemail,

            });
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});