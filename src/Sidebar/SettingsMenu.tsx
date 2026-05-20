import type { Dispatch, SetStateAction } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import CustomDropdown from '../Reactflow-Components/CustomInputWidgets/CustomDropdown';

export interface SettingsMenuProps {
	nodeNamePrefix: string;
	setNodeNamePrefix: Dispatch<SetStateAction<string>>;
	theme: 'dark' | 'light';
	setTheme: Dispatch<SetStateAction<'dark' | 'light'>>;
}

export function SettingsMenu({ nodeNamePrefix, setNodeNamePrefix, theme, setTheme }: SettingsMenuProps) {
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
		</>
	);
}
