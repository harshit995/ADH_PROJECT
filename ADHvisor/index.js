'use strict';
const axios = require('axios');

module.exports.handler = async (event) => {

  console.log(JSON.stringify(event))
    const slot = event.interpretations[0].intent.name;
  try {
    if(slot==="Greetings"){
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
        const Source=event.interpretations[0].intent.slots.Source.value.interpretedValue ;
        const Status=event.interpretations[0].intent.slots.Status.value.interpretedValue;
        const EntityName=event.interpretations[0].intent.slots.EntityName.value.interpretedValue;
        const Consumer=event.interpretations[0].intent.slots.Consumer.value.interpretedValue;
        const StartDate=event.interpretations[0].intent.slots.StartDate.value.interpretedValue;
        const EndDate=event.interpretations[0].intent.slots.EndDate.value.interpretedValue;
        const NumOfTrans=event.interpretations[0].intent.slots.NumOfTrans.value.interpretedValue;
        const ErrorMessage=event.interpretations[0].intent.slots.ErrorMessage.value.interpretedValue;
        const OrgCode=event.interpretations[0].intent.slots.OrgCode.value.interpretedValue;
        const Email=event.interpretations[0].intent.slots.Email.value.interpretedValue;
        const TransactionId=event.interpretations[0].intent.slots.TransactionID.value.interpretedValue;
       
//       let config = {
//   method: 'get',
//   maxBodyLength: Infinity,
//   url: `https://adh-api-stg.heartblr.org/hub/v1/transactionLogs?id=${TransactionId}&startDate=&endDate=&message=&code=&email=&showModal=false&cursor=&pageSize=5&pageOrder=DESC&consumer=&source=&transactionStatus=&entityName=`,
//   headers: { 
//     'Authorization': 'Basic QURIQ0hBVEJPVDpjMzg1NTllNS1kNzIzLTRkNTMtYmQwNi1hMTk5NGFiYmRiNDM='
//   } 
// };
// console.log("..........")
// console.log(config)
// // const datas="harshit here....";
// axios(config)
// .then((response) => {
  
//   console.log(response.data);
//   console.log(response.data.transactionLogs[0].consumer);
//   datas= response.data.transactionLogs[0].consumer;
  
// })
// .catch((error) => {
//   console.log(error);
// });
// let datas;
const res= await axios.get(`https://adh-api-stg.heartblr.org/hub/v1/transactionLogs?id=${TransactionId}&startDate${StartDate}=&endDate=${EndDate}&message=${ErrorMessage}&transactionId=${TransactionId}&code=${OrgCode}&email=${Email}&showModal=false&cursor=&pageSize=${NumOfTrans}&pageOrder=DESC&consumer=${Consumer}&source=${Source}&transactionStatus=${Status}&entityName=${EntityName}`, 

{
  headers:
        {
'Authorization': 'Basic QURIQ0hBVEJPVDpjMzg1NTllNS1kNzIzLTRkNTMtYmQwNi1hMTk5NGFiYmRiNDM=',
'Content-Type':"application/json"
}
})
console.log("hi............");
console.log(res.data.data.transactionLogs[0])
const datas=res.data.data.transactionLogs[0].consumer
  

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
          content: datas
        }
        ]
    }
    }

  } catch (error) {
    console.log(error);
  }
};










import { useState, useRef } from 'react';
import './App.css';
import { LexRuntimeV2 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import Icon from './components/icon';
import Navbar from './components/navbar';
import MessageList from './components/chat';
import Input from './components/input';
import ErrorMessage from './components/error';
import getResponseTemplate from './util/responseTemplate';

const lexRuntime = new LexRuntimeV2({
	region: import.meta.env.VITE_REGION,
	credentials: {
		accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
		secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
	},
});

function App() {
	const [messages, setMessages] = useState([]);
	const [errorMessage, setErrorMessage] = useState('');
	const [showChatbot, setShowChatbot] = useState(false);
	const [sessionId, setSessionId] = useState(uuidv4());
	const messagesEndRef = useRef(null);

	const handleMessageSend = async (message = userInput.trim()) => {
		if (message !== '') {
			setMessages(prevMessages => [
				...prevMessages,
				{ text: message, user: 'user' },
			]);

			try {
				setSessionId(uuidv4());
				const data = await lexRuntime
					.recognizeText({
						botAliasId: import.meta.env.VITE_AWS_BOT_ALIAS_ID,
						botId: import.meta.env.VITE_AWS_BOT_ID,
						localeId: 'en_US',
						text: message,
						sessionId: sessionId,
					})
					.promise();

				console.log(data);
				const botResponse = data.messages;
				if (!botResponse) {
					setMessages(prevMessages => [
						...prevMessages,
						{
							text: 'Something went wrong.... Please try again.',
							user: 'bot',
						},
					]);
				} else {
					const content = botResponse[0].content;
					const adhResponse =
						botResponse.length > 1 ? JSON.parse(botResponse[1].content) : null;
					console.log('ADH backend reponse', adhResponse);
					if (adhResponse?.notInterpreted) {
						setMessages(prevMessages => [
							...prevMessages,
							{
								text: content,
								user: 'bot',
							},
						]);
						return;
					}
					const transactionsList = adhResponse?.data.transactionLogs;
					// console.log('transaction list', transactionsList);
					let idsList = null;
					let singleTransaction = null;
					if (transactionsList && transactionsList.length === 1) {
						singleTransaction = transactionsList[0];
					} else {
						idsList = transactionsList?.map(transaction => ({
							id: transaction.id,
							status: transaction.status,
						}));
					}

					console.log('idlist', idsList);

					setMessages(prevMessages => [
						...prevMessages,
						{
							text: content,
							user: 'bot',
							idsList: idsList && idsList.length > 1 ? idsList : null,
							singleTransaction: singleTransaction,
							responseTemplate:
								idsList && idsList.length > 1
									? getResponseTemplate(idsList.length)
									: null,
							isEmpty: !idsList || idsList?.length === 0,
							isSlotFulfillment: transactionsList ? true : false,
						},
					]);

					setErrorMessage('');
				}
			} catch (error) {
				console.log('Error handling message send:', error);
				setErrorMessage('Something went wrong... Please try again!');
			}
		}
	};

	const handleTransactionIdClick = transactionId => {
		handleMessageSend(String(transactionId));
	};

	const toggleChatbot = () => {
		setShowChatbot(!showChatbot);
	};

	return (
		<div>
			<Icon showChatbot={showChatbot} toggleChatbot={toggleChatbot} />
			{showChatbot && (
				<div className='chatbot'>
					<Navbar />
					<MessageList
						messages={messages}
						handleTransactionIdClick={handleTransactionIdClick}
						ref={messagesEndRef}
					/>
					<Input handleMessageSend={handleMessageSend} />

					{errorMessage && <ErrorMessage errorMessage={errorMessage} />}
				</div>
			)}
		</div>
	);
}

export default App;




