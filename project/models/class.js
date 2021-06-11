var mongoose = require('mongoose')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://minhson123:minhson123@cluster0.v0phx.mongodb.net/project?retryWrites=true&w=majority";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;
const classSchema = new Schema({
    className: String,
    routeName: String,
    stage: String,
    subject: String,
    description: String,
    studentID: [{
        ID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'account'
        },
        grade: {
            type: String,
            default: "Has not been commented yet"
        },
        feedBackContent: {
            type: String,
            default: "Has not been commented yet"
        }
    }],
    teacherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account'
    },
    schedule: [{
        date: String,
        room: String,
        attend: [{
            studentID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'account'
            },
            attended: String,
        }]
    }],
    endDate: String,
    startDate: String,
    classStatus: String,
}, {
    collection: 'class',
    timestamps: true
});

var classModel = mongoose.model('class', classSchema)
module.exports = classModel


// user:{
//     type: Schema.Types.ObjectId,
//     ref: 'users'
// }