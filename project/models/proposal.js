var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://minhson123:minhson123@cluster0.v0phx.mongodb.net/project?retryWrites=true&w=majority";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);


var proposalSchema = new mongoose.Schema({
    proposalName: String,
    Content: String,
    file: String,
    proposalType: String,
    teacherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account'
    },
    uploadDate: { type: Date, default: Date.now },
    Status: {
        type: String,
        default: "None"
    },
    activityInfor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'extracurricularActivities'
    }
})

var proposalModel = mongoose.model('proposal', proposalSchema);
module.exports = proposalModel