var mongoose = require('mongoose')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://minhson123:minhson123@cluster0.v0phx.mongodb.net/project?retryWrites=true&w=majority";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);


function dateNow() {
    var date = new Date()
    var month = date.getMonth() + 1
    var lol = date.getFullYear() + "-" + month + "-" + date.getDate()
    return lol
}

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
    fileLink: String,
    StudentIDoutdoor: [{
        ID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'account'
        },
        FeedBackStudent: {
            type: String,
        },
        ConsideredImplementation: {
            type: String,
        },
        attend: {
            type: String,
            default: "None"
        },
        attendComment: {
            type: String,
            default: "None"
        }
    }],
    extracurricularActivitiesContent: {
        type: String,
    },
    status: {
        type: String,
    },
    comment: {
        type: String,
    },
    uploadDate: String,
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