import { useEffect } from 'react';
import '../../CSS/error-logger.css';

export interface ErrorMessage {
	message: string;
	key: string;
}

interface ErrorMessagePopupProps {
	errorMessage: ErrorMessage;
	removeMessage: (errorMessage: ErrorMessage) => void;
}

const ErrorMessagePopup = ({ errorMessage, removeMessage }: ErrorMessagePopupProps) => {
	// Auto-dismiss after 5 seconds
	useEffect(() => {
		if (errorMessage) {
			const timer = setTimeout(() => {
				removeMessage(errorMessage);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [errorMessage]);

	if (!errorMessage) return null;

	return (
		<div className="error-logger">
			<div className="error-logger-content">
				<i className="bi bi-exclamation-circle"></i>
				<span>
					{errorMessage.message} {errorMessage.key}
				</span>
			</div>
		</div>
	);
};

export default ErrorMessagePopup;
