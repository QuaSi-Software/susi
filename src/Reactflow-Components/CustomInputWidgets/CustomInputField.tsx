import React from 'react';
import { useContext, useState } from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

import { AppContext } from '../../AppContext';
import CustomDropdown from './CustomDropdown';
import { InputObjectType, type InputObject } from './InputObject';
import type { Medium } from '../../NodeDataStructures/Mediums/Medium';
import { Multiselect } from './MultiSelect';
import { FloatLabel } from 'primereact/floatlabel';
import { Locale } from '../../Sidebar/SettingsMenu';

import { de } from 'primelocale/js/de.js';
import { en } from 'primelocale/js/en.js';
import { InputIssueType } from './Validation/InputChecking';
addLocale('de-DE', de);
addLocale('en-US', en);

interface CustomInputFieldProps {
	nodeInput: InputObject;
	onEdit: (resieName: string, newValue: any) => void;
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({ nodeInput, onEdit }) => {
	const displayName = nodeInput.displayName;
	const startValue = nodeInput.value;
	let js_type = nodeInput.type;
	const [inputValue, setInputValue] = useState<any>(startValue);
	const appContext = useContext(AppContext);
	const mediums = appContext?.mediums || [];
	const locale = appContext?.locale || Locale.US;

	// Create a mutable copy for dropdown options
	const nodeInputCopy = { ...nodeInput };

	const onInputChanged = (newInput: any): void => {
		let finalValue: string | number | boolean = newInput;
		if (nodeInput.type === InputObjectType.BOOLEAN) {
			finalValue = !inputValue;
		}
		setInputValue(finalValue);
		onEdit(nodeInput.resieName, finalValue);
	};

	const getInputFieldByType = (): React.ReactNode => {
		const disabledByMutex = nodeInput.issue.issueType === InputIssueType.Mutex;
		switch (js_type) {
			case InputObjectType.VECTOR_FLOAT:
			case InputObjectType.VECTOR_STRING:
			case InputObjectType.CUSTOM_OBJECT:
			case InputObjectType.STRING:
				return (
					<FloatingLabel controlId="floatingInput" label={displayName}>
						<Form.Control
							type="text"
							as="textarea"
							style={{ height: '60px' }}
							placeholder={displayName}
							value={String(inputValue)}
							onChange={(e) => onInputChanged(e.target.value)}
							disabled={disabledByMutex}
						/>
					</FloatingLabel>
				);
			case InputObjectType.INT:
				return (
					<FloatingLabel controlId="floatingInput" label={displayName}>
						<Form.Control
							type="number"
							placeholder={displayName}
							value={String(inputValue)}
							onChange={(e) => onInputChanged(e.target.value)}
							step="1"
							lang={locale}
							isInvalid={!nodeInput.isValid() && nodeInput.isIncluded && !disabledByMutex}
							disabled={disabledByMutex}
						/>
						<label htmlFor="floatingInput" id="unit-label">
							{nodeInput.unit}
						</label>
					</FloatingLabel>
				);
			case InputObjectType.FLOAT:
				return (
					<FloatingLabel controlId="floatingInput" label={displayName}>
						<Form.Control
							type="number"
							placeholder={displayName}
							value={String(inputValue)}
							onChange={(e) => onInputChanged(e.target.value)}
							step="0.01"
							lang={locale}
							isInvalid={!nodeInput.isValid() && nodeInput.isIncluded && !disabledByMutex}
							disabled={disabledByMutex}
						/>
						<label htmlFor="floatingInput" id="unit-label">
							{nodeInput.unit}
						</label>
					</FloatingLabel>
				);
			case InputObjectType.BOOLEAN:
				return (
					<Form.Check
						type="switch"
						id={displayName}
						label={displayName}
						defaultChecked={Boolean(inputValue)}
						onChange={(e) => onInputChanged(e.target.checked)}
						disabled={disabledByMutex}
					/>
				);
			case InputObjectType.DROPDOWN:
				return (
					<CustomDropdown
						displayName={displayName}
						startValue={startValue}
						dropdown_options={nodeInputCopy.dropdownOptions}
						dropdown_options_display_names={nodeInputCopy.dropdownOptionDisplayNames}
						onEdit={onInputChanged}
					/>
				);
			case InputObjectType.MEDIUM:
				return (
					<CustomDropdown<string>
						displayName={displayName}
						startValue={startValue}
						dropdown_options={mediums.map((m: Medium) => m.key)}
						dropdown_options_display_names={mediums.map((m: Medium) => m.name)}
						onEdit={onInputChanged}
					/>
				);
			case InputObjectType.MULTISELECT:
				return (
					<Multiselect
						displayName={displayName}
						startValues={startValue}
						dropdown_options={nodeInputCopy.dropdownOptions}
						dropdown_options_display_names={nodeInputCopy.dropdownOptionDisplayNames}
						onEdit={onInputChanged}
					/>
				);
			case InputObjectType.DATE:
				return (
					<FloatLabel className="p-fluid">
						<Calendar
							value={startValue}
							onChange={(e) => onInputChanged(e.value)}
							showIcon
							showTime
							locale={locale}
							disabled={disabledByMutex}
						/>
						<label htmlFor="intInputWidget" id="floating-label">
							{displayName}
						</label>
					</FloatLabel>
				);
			default:
				console.log('Input ' + displayName + ' has type that is not defined yet.');
				return null;
		}
	};

	let warningMessage = nodeInput.issue.message;
	const showWarningIcon: boolean =
		nodeInput.issue.issueType === InputIssueType.AtLeastOne ||
		nodeInput.issue.issueType === InputIssueType.Validity;
	const showMutexInfo: boolean = nodeInput.issue.issueType === InputIssueType.Mutex;
	return (
		<>
			<span title={warningMessage} className={showWarningIcon ? 'input-warning-message' : 'mutex-warning'}>
				{showWarningIcon && <i className="bi bi-exclamation-circle" />}
				{showMutexInfo && <i className="bi bi-info-circle-fill" />}
				<span> </span>
				{warningMessage}
				<span style={{ visibility: 'hidden' }}>Placeholder</span>
			</span>

			<div data-toggle="tooltip" data-placement="top" title={nodeInput.tooltip}>
				{getInputFieldByType()}
			</div>
		</>
	);
};

export default CustomInputField;
