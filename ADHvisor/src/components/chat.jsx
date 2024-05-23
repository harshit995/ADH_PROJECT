import React, { useEffect, forwardRef } from 'react';
import Table from './table';

const colors = {
	SUCCESS: { backgroundColor: '#98FB98', color: 'black' },
	FAILURE: { backgroundColor: '#FF6347', color: 'white' },
	SKIPPED: { backgroundColor: '#F8EACD', color: 'black' },
	DEFAULT: { backgroundColor: '#a8cded', color: 'black' },
};

const MessageList = forwardRef((props, ref) => {
	const { messages, handleTransactionIdClick } = props;

	useEffect(() => {
		if (ref.current) {
			ref.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	const getButtoncolors = status => {
		return colors[status] || colors.DEFAULT;
	};

	const renderResponseTemplate = message => {
		if (!message.isSlotFulfillment) {
			return;
		}
		if (message.isEmpty) {
			console.log({ message });
			return <p>No transactions found realted to your query!</p>;
		}

		return (
			<>
				{message.responseTemplate && <p>{message.responseTemplate.start}</p>}
				{message.idsList ? (
					<div className='idsList'>
						{message.idsList.map(transaction => (
							<button
								key={transaction.id}
								className='transBtn'
								style={getButtoncolors(transaction.status)}
								onClick={() => handleTransactionIdClick(transaction.id)}
							>
								{transaction.id}
							</button>
						))}
					</div>
				) : (
					''
				)}
				{message.responseTemplate && <p>{message.responseTemplate.end}</p>}
			</>
		);
	};

	return (
		<div className='messages'>
			{messages.map((message, index) => (
				<div
					key={index}
					className={`message ${
						message.user === 'user' ? 'user-message' : 'bot-message'
					}`}
				>
					{!message.isSlotFulfillment &&
					!message.idsList &&
					!message.singleTransaction
						? message.text
						: ''}
					{!message.singleTransaction && renderResponseTemplate(message)}
					{message.singleTransaction && (
						<Table details={message.singleTransaction} />
					)}
				</div>
			))}
			<div ref={ref} />
		</div>
	);
});

export default MessageList;
