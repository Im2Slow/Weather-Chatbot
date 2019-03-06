'use strict';

const conf = require('./config');
let FBeamer = require('./FBeamer');
const express = require('express');
let bodyParser = require('body-parser');
const matcher = require('./matcher');
const weather = require('./weather');

const server = express();
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
let fBeamer  = new FBeamer(conf.FB.pageAccessToken, conf.FB.verifyToken);

server.get('/webhook', (req, res) => fBeamer.registerHook(req,res));
server.post('/webhook', (req, res) => fBeamer.incoming(req,res, (output) => {
  var textMsg = "";
  matcher(output.message, cb =>{
    switch(cb.intent){

      case "Hello":
      textMsg = cb.entities.greetings + ", I can give you the weather of most cities, try me!";
      break;

      case "help":
      textMsg = "YOUR SAVIOR HAS ARRIVED ! BEHOLD ALL THE COMMANDS I CAN HANDLE\n-'hello' : greetings are important, since words are all I got\n-'exit' : Go ahead, leave me behind, i'm just a dead weight anyway..\n-'weather in theCityYouWant' : gives you the weather in the given city\n-'condition in theCityYouWant time' : condition can be sunny,rainy, foggy, cloudy, warm; time can be today or tomorrow";
      break;

      case "Exit":
      textMsg = "Good Bye !"
      break;

      case "Forecast Weather":
      var i = 0;
      if(cb.entities.time === "tomorrow"){
        i = 2;
      }
      else if(cb.entities.time === "today"){
        i = 1;
      }
      weather(cb.entities.city, i).then(function(data){
        if(data.current.condition.text.toUpperCase().includes(cb.entities.weather.toUpperCase())){
          textMsg = "Yes, ";
        }else{
          textMsg = "No, ";
        }
        textMsg += "It will be " +  data.current.condition.text + " in " +data.location.name +", "+data.location.country +' '+cb.entities.time+" with "+ data.current.temp_c + "°C"+ " and a humidity rate of " + data.current.humidity + "%";
        fBeamer.text(output,textMsg);
        if(data.current.temp_c > 30){
          fBeamer.image(output, "https://media.giphy.com/media/3o6ozh46EbuWRYAcSY/giphy.gif");
        }else if(data.current.temp_c > 20){
          fBeamer.image(output, "https://media.giphy.com/media/jmG9f3aumasGk/giphy.gif");
        }else if(data.current.temp_c > 10){
          fBeamer.image(output, "https://media.giphy.com/media/1060C3ZvLPEOAM/giphy.gif");
        }else if(data.current.temp_c > 0){
          fBeamer.image(output, "https://media.giphy.com/media/8coWUzsIJnJ3QOwUmR/giphy.gif");
        }else{
          fBeamer.image(output, "https://media.giphy.com/media/s4Bi420mMDRBK/giphy.gif");
        }
      }).catch(function(err){
        textMsg = "Sorry, you're asking too much";
      })
      break;

      case "Current Weather":
      weather(cb.entities.city,1).then(function(data){
        textMsg = "It is " + data.current.condition.text+ " in " +data.location.name +", "+data.location.country+" with "+data.current.temp_c + "°C"+ " and a humidity rate of " + data.current.humidity + "%";
        fBeamer.text(output,textMsg);
        if(data.current.temp_c > 30){
          fBeamer.image(output, "https://media.giphy.com/media/3o6ozh46EbuWRYAcSY/giphy.gif");
        }else if(data.current.temp_c > 20){
          fBeamer.image(output, "https://media.giphy.com/media/jmG9f3aumasGk/giphy.gif");
        }else if(data.current.temp_c > 10){
          fBeamer.image(output, "https://media.giphy.com/media/1060C3ZvLPEOAM/giphy.gif");
        }else if(data.current.temp_c > 0){
          fBeamer.image(output, "https://media.giphy.com/media/8coWUzsIJnJ3QOwUmR/giphy.gif");
        }else{
          fBeamer.image(output, "https://media.giphy.com/media/s4Bi420mMDRBK/giphy.gif");
        }
      }).catch(function(err){
        textMsg = "Sorry, I couldn't find your city in the database";
      })
      break;

      default:
      textMsg = "Sorry, I didn't quite catch that, could you please reformulate ?  (Do not hesitate to ask for 'help')";
      break;
    }
  });
  fBeamer.text(output,textMsg);
}));
server.listen(PORT, () => console.log("running on port : " + PORT));
