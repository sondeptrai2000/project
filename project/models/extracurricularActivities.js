var mongoose = require('mongoose');

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

var extracurricularActivitiesSchema = new mongoose.Schema({
    fileLink: String,
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
    uploadDate: { type: String, default: dateNow() }
})

var extracurricularActivitiesModel = mongoose.model('extracurricularActivities', extracurricularActivitiesSchema);
module.exports = extracurricularActivitiesModel