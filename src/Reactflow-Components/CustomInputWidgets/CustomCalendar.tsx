import type { Locale } from '../../Sidebar/SettingsMenu';
import 'react-widgets/styles.css';
import { useState } from 'react';
import { exportDate } from './DateParsing';
import { FloatLabel } from 'primereact/floatlabel';

interface CustomCalendarProps {
	date: Date;
	locale: Locale;
	disabled: boolean;
	displayName: string;
	onInputChanged: (newInput: any) => void;
}

export function CustomCalendar({ date, disabled, displayName }: CustomCalendarProps) {
	const [value, setValue] = useState<Date>(date);
	const dateString = `${exportDate(value, 'yyyy-mm-dd')}T${exportDate(value, 'HH:MM')}`;
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
						setValue(newDate);
					}}
				/>
				<label htmlFor={displayName} id="floating-label">
					{displayName}
				</label>
			</FloatLabel>
		</>
	);
}
