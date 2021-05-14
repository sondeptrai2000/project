var mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://minhson123:minhson123@cluster0.v0phx.mongodb.net/project?retryWrites=true&w=majority";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);


var feedBackSchema= new mongoose.Schema({
    classID :String,
    studentID:String,
    teacherID:String,
    feedBackContent: {
        type : String,
        default : "Has not been commented yet"
    }
})

var feedBackModel = mongoose.model('feedBack',feedBackSchema);

module.exports = feedBackModel
