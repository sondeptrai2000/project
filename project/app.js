var express = require('express');
var mongoose = require('mongoose');
var gridfs = require('gridfs-stream');
var fs = require('fs');

var app = express();

/*
	Make a MongoDB connection
*/
mongoose.connect('mongodb://localhost:27017/test')
mongoose.Promise = global.Promise;

gridfs.mongo = mongoose.mongo;
/*
	Check MongoDB connection
*/
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));

connection.once('open', () => {
    var gfs = gridfs(connection.db);

    // Upload a file from loca file-system to MongoDB
    app.get('/api/file/upload', (req, res) => {

        var filename = "FB_IMG_1513215779697.jpg";
        var writestream = gfs.createWriteStream({ filename: filename });
        fs.createReadStream(__dirname + "/public/uploads/" + filename).pipe(writestream);
        writestream.on('close', (file) => {
            res.send('Stored File: ' + file.filename);
        });
    });

    // Download a file from MongoDB - then save to local file-system
    app.get('/api/file/download', (req, res) => {
        // Check file exist on MongoDB

        var filename = "FB_IMG_1513215779697.jpg";

        gfs.exist({ filename: filename }, (err, file) => {
            if (err || !file) {
                res.status(404).send('File Not Found');
                return
            }

            var readstream = gfs.createReadStream({ filename: filename });
            readstream.pipe(res);
        });
    });

    // Delete a file from MongoDB
    app.get('/api/file/delete', (req, res) => {

        var filename = "FB_IMG_1513215779697.jpg";

        gfs.exist({ filename: filename }, (err, file) => {
            if (err || !file) {
                res.status(404).send('File Not Found');
                return;
            }

            gfs.remove({ filename: filename }, (err) => {
                if (err) res.status(500).send(err);
                res.send('File Deleted');
            });
        });
    });

    // Get file information(File Meta Data) from MongoDB
    app.get('/api/file/meta', (req, res) => {

        var filename = "FB_IMG_1513215779697.jpg";

        gfs.exist({ filename: filename }, (err, file) => {
            if (err || !file) {
                res.send('File Not Found');
                return;
            }

            gfs.files.find({ filename: filename }).toArray((err, files) => {
                if (err) res.send(err);
                res.json(files);
            });
        });
    });

    var server = app.listen(8081, () => {

        var host = server.address().address
        var port = server.address().port

        console.log("App listening at http://%s:%s", host, port);
    });

});