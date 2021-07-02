var mongoose = require("mongoose");
//const { stringify } = require("querystring");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://minhson123:minhson123@cluster0.v0phx.mongodb.net/project?retryWrites=true&w=majority";
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Schema = mongoose.Schema;
const AccountSchema = new Schema({
    avatar: String,
    username: String,
    password: String,
    email: String,
    aim: String,
    routeName: String,
    stage: String,
    chat: [{
        type: String,
    }],
    guardian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account'
    },
    role: {
        type: String,
        default: "none"
    },
    classID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'class'
    }],
    sex: String,
    phone: String,
    address: String,
    birthday: String,
}, {
    collection: 'account'
});

var AccountModel = mongoose.model('account', AccountSchema);
module.exports = AccountModel