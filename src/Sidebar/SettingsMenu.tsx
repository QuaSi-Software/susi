import { useContext, type Dispatch, type SetStateAction } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import CustomDropdown from '../Reactflow-Components/CustomInputWidgets/CustomDropdown';
import { AppContext } from '../AppContext';

export interface SettingsMenuProps {
	nodeNamePrefix: string;
	setNodeNamePrefix: Dispatch<SetStateAction<string>>;
	theme: 'dark' | 'light';
	setTheme: Dispatch<SetStateAction<'dark' | 'light'>>;
	setLocale: Dispatch<SetStateAction<Locale>>;
}

export const Locale = {
	US: 'en-US',
	DE: 'de-DE',
	IN: 'en-IN',
} as const;

export type Locale = (typeof Locale)[keyof typeof Locale];

export function SettingsMenu({ nodeNamePrefix, setNodeNamePrefix, theme, setTheme, setLocale }: SettingsMenuProps) {
	const locale = useContext(AppContext)!.locale;
	return (
		<>
			<div className="sidebar-heading">Settings</div>
			<FloatingLabel
				controlId="floatingInput"
				label={'UAC Prefix for Component Names'}
				className="input-menu-row"
			>
				<Form.Control
					type="text"
					as="textarea"
					style={{ fontSize: '24px', height: 'min-content' }}
					placeholder={'UAC Prefix for Component Names'}
					value={nodeNamePrefix}
					autoFocus
					onChange={(e) => setNodeNamePrefix(e.target.value)}
				/>
			</FloatingLabel>
			<div className="input-menu-row">
				<CustomDropdown<'light' | 'dark'>
					displayName="Theme"
					startValue={theme}
					dropdown_options={['light', 'dark']}
					dropdown_options_display_names={['☀️ Light Mode', '🌙 Dark Mode']}
					onEdit={(value) => setTheme(value)}
				/>
			</div>
			<div className="input-menu-row">
				<CustomDropdown<Locale>
					displayName="Locale (for number formatting)"
					startValue={locale}
					dropdown_options={[Locale.DE, Locale.US, Locale.IN]}
					dropdown_options_display_names={['DE', 'US', 'IN']}
					onEdit={(value) => setLocale(value)}
				/>
			</div>
		</>
	);
}
