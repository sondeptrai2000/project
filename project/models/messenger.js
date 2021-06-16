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
    person1: String,
    person2: String,
    message: [{
        ownermessenger: String,
        messContent: String,
    }]
})

var chatModel = mongoose.model('chat', chatSchema);

module.exports = chatModel