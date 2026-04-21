import { useEffect, useState } from 'react';
import ErrorMessagePopup, { type ErrorMessage } from './ErrorMessage';

interface ErrorLoggerProps {
	messages: ErrorMessage[];
	setMessages: (messages: ErrorMessage[]) => void;
}

const ErrorMenu = ({ messages, setMessages }: ErrorLoggerProps) => {
	const [isClickable, setIsClickable] = useState(false);

	// Enable clicking after a short delay to prevent immediate dismissal
	useEffect(() => {
		if (messages.length === 0) {
			setIsClickable(false);
			return;
		}

		const timer = setTimeout(() => {
			setIsClickable(true);
		}, 300);

		return () => clearTimeout(timer);
	}, [messages]);

	// Dismiss on any click (only if clickable)
	// useEffect(() => {
	// 	if (messages.length === 0 || !isClickable) return;

	// 	const handleClick = () => {
	// 		setMessages([]);
	// 	};

	// 	document.addEventListener('click', handleClick);
	// 	return () => document.removeEventListener('click', handleClick);
	// }, [messages, isClickable, setMessages]);

	const removeMessage = (message: ErrorMessage) => {
		const newMessages = messages.filter((m) => m.key !== message.key);
		setMessages(newMessages);
	};

	if (messages.length === 0) return null;
	return (
		<div className="error-menu-container">
			{messages.map((message) => (
				<ErrorMessagePopup key={message.key} errorMessage={message} removeMessage={removeMessage} />
			))}
		</div>
	);
};

export default ErrorMenu;
