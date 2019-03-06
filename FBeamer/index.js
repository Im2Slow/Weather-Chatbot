"use strict";
let request = require('request');

class FBeamer{
  constructor(pageAccessToken, verifyToken){
    this.pageAccessToken = pageAccessToken;
    this.verifyToken = verifyToken;
  }
  registerHook(req,res){
    const params = req.query;
    const mode = params['hub.mode'],
    token = params['hub.verify_token'],
    challenge = params['hub.challenge'];
    try {
      if(mode === "subscribe" && token === this.verifyToken){
        console.log("Webhook registered");
        return res.send(challenge);
      } else{
        throw "Could not register the webhook";
        return res.sendStatus(403);
      }
    } catch(e) {
      console.log(e);
    }
  }
  incoming(req,res, callback){
    let data = req.body;
    var output;
    try{
      if(data.object === "page"){
        data.entry.forEach(pageObj => {
          pageObj.messaging.forEach(messageObj =>{
            output = {
              id: messageObj.sender.id,
              timeOfMessage: messageObj.timestamp,
              message: messageObj.message.text
            }
          });
          callback(output);
        });
        res.sendStatus(200);
      }
      else{
        res.sendStatus(404);
      }
    } catch(e) {
      callback(e);
    }
  }
  text(sender, answer){
    try{
      request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs:{
          access_token: this.pageAccessToken
        },
        method: 'POST',
        json:{
          messaging_type: "RESPONSE",
          recipient: {
            id: sender.id
          },
          message:{
            text: answer
          }
        }
      })
      console.log("text sent");
    } catch(e){
      console.log(e);
    }
  }
  image(sender, imgUrl){
    try{
      request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs:{
          access_token: this.pageAccessToken
        },
        method: 'POST',
        json:{
          messaging_type: "RESPONSE",
          recipient: {
            id: sender.id
          },
          message:{
            attachment:{
              type: "image",
              payload: {
                url: imgUrl
              }
            }
          }
        }
      })
      console.log("image sent");
    } catch(e){
      console.log(e);
    }
  }
}

module.exports = FBeamer;
