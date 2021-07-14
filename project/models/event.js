var mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://minhson123:minhson123@cluster0.v0phx.mongodb.net/project?retryWrites=true&w=majority";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);


var eventSchema = new mongoose.Schema({
    folderID: String,
    eventName: String,
    eventContent: String,
    eventAddress: String,
    eventAt: String,
    eventProposal: String,
    proposals: [{
        fileLink: String,
        teacherID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'account'
        },
        status: String,
        comment: String
    }]
})

var eventModel = mongoose.model('event', eventSchema);
module.exports = eventModel