var mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://minhson123:minhson123@cluster0.v0phx.mongodb.net/project?retryWrites=true&w=majority";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);


var extracurricularActivitiesSchema = new mongoose.Schema({
    fileLink: String,
    classID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'class'
    },
    StudentID: [{
        ID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'account'
        },
        FeedBackStudent: {
            type: String,
            default: "Has not been commented yet"
        },
        ConsideredImplementation: {
            type: String,
            default: "Not Considered Implementation Yet"
        },
    }],
    teacherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account'
    },
    extracurricularActivitiesContent: {
        type: String,
        default: "Has not been commented yet"
    },
    status: {
        type: String,
        default: "Has not been commented yet"
    },
    comment: {
        type: String,
        default: "Has not been commented yet"
    },
    uploadDate: { type: Date, default: Date.now }
})

var extracurricularActivitiesModel = mongoose.model('extracurricularActivities', extracurricularActivitiesSchema);
module.exports = extracurricularActivitiesModel