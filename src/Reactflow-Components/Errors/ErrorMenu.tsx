import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import ErrorMessagePopup, { type ErrorMessage } from './ErrorMessage';
import { Button } from 'react-bootstrap';

interface ErrorLoggerProps {
	messages: ErrorMessage[];
	setMessages: Dispatch<SetStateAction<ErrorMessage[]>>;
}

const ErrorMenu = ({ messages, setMessages }: ErrorLoggerProps) => {
	/** messages are packed in a ref, because otherwise removeMessage
	 * will be using a stale version of messages without all the messages in it*/
	const messagesRef = useRef(messages);
	useEffect(() => {
		messagesRef.current = messages;
	}, [messages]);

	const removeMessage = (message: ErrorMessage) => {
		setMessages((prevMessages) => prevMessages.filter((m) => m.key !== message.key));
	};
	const clearErrorMenu = () => {
		setMessages([]);
	};

	if (messages.length === 0) return null;
	return (
		<div className="error-menu-container">
			<Button variant={'outline-danger'} onClick={clearErrorMenu}>
				<i className="bi bi-trash3" /> Clear Error Messages
			</Button>
			{messages.map((message) => (
				<ErrorMessagePopup key={message.key} errorMessage={message} removeMessage={removeMessage} />
			))}
		</div>
	);
};

export default ErrorMenu;
