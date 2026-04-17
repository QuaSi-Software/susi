import { useEffect, useState } from 'react';
import '../CSS/error-logger.css';

interface ErrorLoggerProps {
	message: string | null;
	onClear: () => void;
}

const ErrorLogger = ({ message, onClear }: ErrorLoggerProps) => {
	const [isClickable, setIsClickable] = useState(false);

	// Auto-dismiss after 5 seconds
	useEffect(() => {
		if (message) {
			const timer = setTimeout(() => {
				onClear();
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [message, onClear]);

	// Enable clicking after a short delay to prevent immediate dismissal
	useEffect(() => {
		if (!message) {
			setIsClickable(false);
			return;
		}

		const timer = setTimeout(() => {
			setIsClickable(true);
		}, 300);

		return () => clearTimeout(timer);
	}, [message]);

	// Dismiss on any click (only if clickable)
	useEffect(() => {
		if (!message || !isClickable) return;

		const handleClick = () => {
			onClear();
		};

		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, [message, isClickable, onClear]);

	if (!message) return null;

	return (
		<div className="error-logger">
			<div className="error-logger-content">
				<i className="bi bi-exclamation-circle"></i>
				<span>{message}</span>
			</div>
		</div>
	);
};

export default ErrorLogger;
