import type { Locale } from '../../Sidebar/SettingsMenu';
import { exportDate } from './DateParsing';
import { FloatLabel } from 'primereact/floatlabel';

interface CustomCalendarProps {
	date: Date;
	locale: Locale;
	disabled: boolean;
	displayName: string;
	onInputChanged: (newInput: any) => void;
}

export function CustomCalendar({ date, disabled, displayName, onInputChanged }: CustomCalendarProps) {
	const dateString = `${exportDate(date, 'yyyy-mm-dd')}T${exportDate(date, 'HH:MM')}`;
	const hasValue = dateString && dateString.length > 0;
	return (
		<>
			<FloatLabel>
				<input
					className={`form-control ${hasValue ? 'p-filled' : ''}`}
					type="datetime-local"
					id={displayName}
					name={displayName}
					disabled={disabled}
					value={dateString}
					style={{ height: '3.5em' }}
					onChange={(e) => {
						const newDate = new Date(e.target.value);
						onInputChanged(newDate);
					}}
				/>
				<label htmlFor={displayName} id="floating-label">
					{displayName}
				</label>
			</FloatLabel>
		</>
	);
}
