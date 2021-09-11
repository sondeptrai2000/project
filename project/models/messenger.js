var mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://minhson123:minhson123@cluster0.v0phx.mongodb.net/project?retryWrites=true&w=majority";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


var chatSchema = new mongoose.Schema({
    person1: { type: mongoose.Schema.Types.ObjectId, ref: 'account' },
    person2: { type: mongoose.Schema.Types.ObjectId, ref: 'account' },
    message: [{
        ownermessengerID: String,
        ownermessenger: String,
        messContent: String,
        time: { type: Date, default: Date.now }
    }],
    updateTime: { type: Date, default: Date.now }
})

var chatModel = mongoose.model('chat', chatSchema);

module.exports = chatModel