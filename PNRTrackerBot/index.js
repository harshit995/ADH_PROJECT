'use strict';
const axios = require("axios");

// Lambda function to get weather information
module.exports.getWeather = async (event) => {
  // Extracting the city from the event object
  const city = event.interpretations[0].intent.slots.City.value.interpretedValue;

  // Constructing the OpenWeatherMap API URL with the city and API key
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=4db3b5ebf21c11d90c12191df037ac3d";

  try {
    // Making an asynchronous GET request to the OpenWeatherMap API
    const response = await axios.get(url);
    const data = response.data;

    // Constructing the response message with weather information
    const answer = "The temperature is " + data.main.temp + "C and Humidity is " + data.main.humidity + "%, and " + data.weather[0].description + " is expected.";

    // Returning the response object with session state and messages
    return {
      sessionState: {
        dialogAction: {
          type: "Close"
        },
        intent: {
          name: "FindingWeather",
          state: "Fulfilled"
        }
      },
      messages: [
        {
          contentType: "PlainText",
          content: answer
        }
      ]
    };
  } catch (error) {
    // Logging any errors that occur during the API request
    console.log(error);
  }
};
