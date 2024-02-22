'use strict';
const axios = require("axios");

module.exports.getWeather = async (event) => {
  // const city = "agra";
  console.log(JSON.stringify(event))
    const city = event.interpretations[0].intent.slots.City.value.interpretedValue;
        // const city = event.inputTranscript;

    


  const url = "https://api.openweathermap.org/data/2.5/weather?q=" +city + "&units=metric&appid=4db3b5ebf21c11d90c12191df037ac3d";


  try {
    const response = await axios.get(url);
    const data = response.data;

    const answer = "The temperature is " + data.main.temp + "C and Humidity is " + data.main.humidity + "% and " + data.weather[0].description + " is expected.";
    
    return {
      sessionState: {
        dialogAction :{
          type: "Close"
        },
        intent:{
          name:"FindingWeather",
          state:"Fulfilled"
        }
      },
      messages:[
        {
          contentType: "PlainText",
          content: answer
        }
        ]
    }

  } catch (error) {
    console.log(error);
  }
};