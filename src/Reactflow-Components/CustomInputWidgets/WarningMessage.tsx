interface WarningMessageProps {
	redWarning: boolean;
	message: string;
	hoverMessage?: string;
}

export function WarningMessage({ redWarning, message, hoverMessage }: WarningMessageProps) {
	if (!hoverMessage) hoverMessage = message;
	let iconName = '';
	let textClass = '';
	if (redWarning) {
		iconName = 'bi bi-exclamation-circle';
		textClass = 'warning-text';
	} else if (message !== '') {
		iconName = 'bi bi-info-circle-fill';
		textClass = 'mutex-warning';
	}
	return (
		<span title={hoverMessage} className={`input-warning-message ${textClass}`}>
			{iconName && <i className={iconName} />}
			<span> </span>
			{message}
			<span style={{ visibility: 'hidden' }}>Placeholder</span>
		</span>
	);
}
