interface LoadingOverlayProps {
	message: string | null;
}

const LoadingOverlay = ({ message }: LoadingOverlayProps) => {
	if (message === null) return null;

	return (
		<div className="loading-overlay">
			<div className="loading-container">
				<div className="loading-spinner"></div>
				<p className="loading-message">{message}</p>
			</div>
		</div>
	);
};

export default LoadingOverlay;
