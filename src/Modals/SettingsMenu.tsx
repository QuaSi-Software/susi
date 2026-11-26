import { useContext, type Dispatch, type SetStateAction } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import CustomDropdown from '../Reactflow-Components/CustomInputWidgets/CustomDropdown';
import { AppContext } from '../AppContext';
import { EdgeType, type SusiEdge } from '../NodeDataStructures/Edges/SusiEdge';

export interface SettingsMenuProps {
	nodeNamePrefix: string;
	setNodeNamePrefix: Dispatch<SetStateAction<string>>;
	theme: 'dark' | 'light';
	setTheme: Dispatch<SetStateAction<'dark' | 'light'>>;
	setLocale: Dispatch<SetStateAction<Locale>>;
	edgeType: EdgeType;
	setEdgeType: Dispatch<SetStateAction<EdgeType>>;
	setEdges: Dispatch<SetStateAction<SusiEdge[]>>;
	exportFileName: string;
	setExportFileName: Dispatch<SetStateAction<string>>;
}

export const Locale = {
	US: 'en-US',
	DE: 'de-DE',
} as const;

export type Locale = (typeof Locale)[keyof typeof Locale];

export function SettingsMenu({
	nodeNamePrefix,
	setNodeNamePrefix,
	theme,
	setTheme,
	setLocale,
	edgeType,
	setEdgeType,
	setEdges,
	exportFileName,
	setExportFileName,
}: SettingsMenuProps) {
	const locale = useContext(AppContext)!.locale;

	function onExportFileNameChange(fileName: string) {
		// Strip characters that are invalid in filenames on Windows/macOS/Linux
		const disallowedChars = /[<>.:"/\\|?*\x00-\x1F\s]/g;
		setExportFileName(fileName.replace(disallowedChars, ''));
	}

	return (
		<>
			{/** UAC Prefix input widget */}
			<FloatingLabel
				controlId="floatingInput"
				label={'UAC Prefix for Component Names'}
				className="input-menu-row"
			>
				<Form.Control
					type="text"
					as="textarea"
					placeholder={'UAC Prefix for Component Names'}
					value={nodeNamePrefix}
					autoFocus
					onChange={(e) => setNodeNamePrefix(e.target.value)}
				/>
			</FloatingLabel>
			{/** Export File name input widget */}
			<FloatingLabel controlId="floatingInput" label={'Name for export file'} className="input-menu-row">
				<Form.Control
					type="text"
					as="textarea"
					placeholder={'Name for export file'}
					value={exportFileName}
					autoFocus
					onChange={(e) => onExportFileNameChange(e.target.value)}
				/>
			</FloatingLabel>
			{/** Theme input widget */}
			<div className="input-menu-row">
				<CustomDropdown<'light' | 'dark'>
					displayName="Theme"
					startValue={theme}
					dropdown_options={['light', 'dark']}
					dropdown_options_display_names={['☀️ Light Mode', '🌙 Dark Mode']}
					onEdit={(value) => setTheme(value)}
				/>
			</div>
			{/** Edge Type Input Widget */}
			<div className="input-menu-row">
				<CustomDropdown<EdgeType>
					displayName="Edge Type"
					startValue={edgeType}
					dropdown_options={Object.values(EdgeType)}
					onEdit={(value) => {
						setEdgeType(value);
						setEdges((edges) => edges.map((e) => ({ ...e, type: value })));
					}}
				/>
			</div>
			{/** Locale für Datum und number format input widget */}
			<div
				className="input-menu-row"
				data-toggle="tooltip"
				data-placement="top"
				title="Locale for number inputs and date formatting"
			>
				<CustomDropdown<Locale>
					displayName="Locale"
					startValue={locale}
					dropdown_options={[Locale.DE, Locale.US]}
					dropdown_options_display_names={['DE', 'US']}
					onEdit={(value) => setLocale(value)}
				/>
			</div>
		</>
	);
}
