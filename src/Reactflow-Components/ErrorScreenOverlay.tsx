interface ErrorOverlayProps {
	message: string | null;
}

const ErrorOverlay = ({ message }: ErrorOverlayProps) => {
	if (message === null) return null;

	return (
		<div className="loading-overlay">
			<div className="loading-container">
				<p className="overlay-error-message">
					<i className="bi bi-exclamation-circle" />
					<span> </span>
					{message}
				</p>
			</div>
		</div>
	);
};

export default ErrorOverlay;
