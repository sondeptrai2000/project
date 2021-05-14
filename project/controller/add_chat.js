
const AccountModel = require("../models/account");
const chatModel = require("../models/chat");

const express = require("express");
const router = express.Router();
// const mongodb = require("mongodb");


var add_chat = {
    post: (req, res) => {
            AccountModel.findOne({ email: req.cookies.email }, (err, cookies) => {
                AccountModel.findOne({ email: req.params.email }, (err, data) => {
                    let chat1 = {
                                    userSend: req.cookies.email,
                                    userReceive: req.params.email,
                                    message: []
                                }
                    chatModel.create(chat1); 
                    let chat2 = {
                                    userSend: req.params.email,
                                    userReceive: req.cookies.email,
                                    message: []
                                }
                    chatModel.create(chat2);
                       // send respond to client
                       if(cookies.role ==="student"){
                        res.redirect('/message/send_messageCoordinator/'+req.cookies.email +'/'+req.params.email)
                     }else{
                        res.redirect('/message/send_message/'+req.cookies.email +'/'+req.params.email)
                     }
                 })
            })   
            
    },
}
module.exports = add_chat;