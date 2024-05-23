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
