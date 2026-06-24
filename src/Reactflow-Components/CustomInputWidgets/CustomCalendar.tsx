import 'react-datepicker/dist/react-datepicker.css';
import type { Locale } from '../../Sidebar/SettingsMenu';
import { FloatLabel } from 'primereact/floatlabel';
import { Calendar } from 'primereact/calendar';

interface CustomCalendarProps {
	date: any;
	locale: Locale;
	disabled: boolean;
	displayName: string;
	onInputChanged: (newInput: any) => void;
}

export function CustomCalendar({ date, locale, disabled, displayName, onInputChanged }: CustomCalendarProps) {
	return (
		<FloatLabel className="p-fluid">
			<Calendar
				value={date}
				onChange={(e) => {
					onInputChanged(e.value);
				}}
				showIcon
				showTime
				locale={locale}
				disabled={disabled}
				hideOnDateTimeSelect
			/>
			<label htmlFor="intInputWidget" id="floating-label">
				{displayName}
			</label>
		</FloatLabel>
	);
}
