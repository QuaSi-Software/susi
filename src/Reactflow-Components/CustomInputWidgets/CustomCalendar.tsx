import 'react-datepicker/dist/react-datepicker.css';
import type { Locale } from '../../Sidebar/SettingsMenu';
import { useRef, useState } from 'react';
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
	const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
	const cal = useRef(null);

	// const handleCalendarKeyDown = (e: React.KeyboardEvent) => {
	// 	if (e.key === 'Enter') {
	// 		setCalendarVisible(false);
	// 	}
	// };
	return (
		<FloatLabel className="p-fluid">
			<Calendar
				ref={cal}
				value={date}
				onChange={(e) => {
					onInputChanged(e.value);
				}}
				showIcon
				showTime
				visible={calendarVisible}
				onVisibleChange={(e) => setCalendarVisible(e.visible)}
				footerTemplate={() => (
					<div className="footer-calendar">
						<button
							onClick={() => {
								setCalendarVisible(false);
							}}
						>
							Done
						</button>
					</div>
				)}
				locale={locale}
				disabled={disabled}
			/>
			<label htmlFor="intInputWidget" id="floating-label">
				{displayName}
			</label>
		</FloatLabel>
	);
}
