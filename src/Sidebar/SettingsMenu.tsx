import type { Dispatch, SetStateAction } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';

export interface SettingsMenuProps {
	nodeNamePrefix: string;
	setNodeNamePrefix: Dispatch<SetStateAction<string>>;
}

export function SettingsMenu({ nodeNamePrefix, setNodeNamePrefix }: SettingsMenuProps) {
	return (
		<>
			<div className="sidebar-heading">Settings</div>
			<FloatingLabel controlId="floatingInput" label={'UAC Prefix for Component Names'}>
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
		</>
	);
}
