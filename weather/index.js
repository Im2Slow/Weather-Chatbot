'use strict';
const axios = require('axios');
const apikey = 'd811c3e357bb46c894f20421191302';

const getWeather = (location,i) => {
  return new Promise(async (resolve, reject) => {
    try{
      const weatherConditions = await axios.get('http://api.apixu.com/v1/forecast.json',
      {
        params: {
          key: apikey,
          q: location,
          days: i
        }
      });
      resolve(weatherConditions.data);
    }
    catch(error){
      reject(error);
    }
  });
}
module.exports = getWeather;
