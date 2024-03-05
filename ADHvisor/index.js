'use strict';
const axios = require("axios");

module.exports.handler = async (event) => {

  console.log(JSON.stringify(event))
    const slot = event.interpretations[0].intent.name;

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: process.env.url,
  headers: { 
    'Authorization': ''
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});








  try {
    if(slot=="Greetings"){
    return {
      sessionState: {
        dialogAction :{
          type: "Close"
        },
        intent:{
          name:"Greetings",
          state:"Fulfilled"
        }
      },
      messages:[
        {
          contentType: "PlainText",
          content: `Hey .......... 
          and I'll help you out😊!`
        }
        ]
    }
    }else{
        return {
      sessionState: {
        dialogAction :{
          type: "Close"
        },
        intent:{
          name:"GetSlots",
          state:"Fulfilled"
        }
      },
      messages:[
        {
          contentType: "PlainText",
          content:"Hello user..."
        }
        ]
    }
    }

  } catch (error) {
    console.log(error);
  }
};