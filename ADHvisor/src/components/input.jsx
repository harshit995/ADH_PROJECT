import { useState, useRef } from 'react';

const Input = props => {
	const { handleMessageSend } = props;

	const [inputError, setInputError] = useState(false);
	const userInputRef = useRef();

	const validateInput = () => {
		if (userInputRef.current.value === '') {
			setInputError('Enter the message to continue...');
			return false;
		}

		return true;
	};

	const handleInputKeyPress = event => {
		if (event.key === 'Enter') {
			handleSendButtonClick();
		}
	};

	const handleSendButtonClick = () => {
		if (validateInput()) {
			handleMessageSend(userInputRef.current.value);
			userInputRef.current.value = '';
			focusOnInput();
		}
	};

	const focusOnInput = () => {
		if (userInputRef.current) {
			userInputRef.current.focus();
		}
	};

	const inputChangeHandler = () => {
		if (userInputRef.current.value != '') {
			setInputError(false);
		}
	};

	return (
		<div className='input'>
			<input
				ref={userInputRef}
				type='text'
				onChange={inputChangeHandler}
				onKeyPress={handleInputKeyPress}
				placeholder={
					inputError
						? 'Enter some message to continue...'
						: 'Enter your message here...'
				}
				className={inputError ? 'error' : ''}
				style={{ border: inputError ? '1px solid red' : '' }}
				autoFocus
			/>
			<svg
				onClick={handleSendButtonClick}
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				width='24'
				height='24'
				fill='none'
				stroke='#c10b1f'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
				className='feather feather-send'
			>
				<line x1='22' y1='2' x2='11' y2='13'></line>
				<polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
			</svg>
		</div>
	);
};

export default Input;
