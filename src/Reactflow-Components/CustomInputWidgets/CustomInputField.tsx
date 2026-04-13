import { useState } from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import CustomDropdown from './CustomDropdown';
// import { AppContext } from './../AppContext';
import { NodeInputType, type NodeInput } from '../../NodeDataStructures/NodeInput';
import React from 'react';

interface CustomInputFieldProps {
	nodeInput: NodeInput;
	onEdit: (resieName: string, newValue: string | number | boolean) => void;
}

const CustomInputField: React.FC<CustomInputFieldProps> = ({ nodeInput, onEdit }) => {
	const displayName = nodeInput.displayName;
	const startValue = nodeInput.value;
	let js_type = nodeInput.type;
	const [inputValue, setInputValue] = useState<any>(startValue);
	// const appContext = useContext(AppContext);
	// const mediums = appContext?.mediums || [];
	// const mediums = [];

	// Create a mutable copy for dropdown options
	const nodeInputCopy = { ...nodeInput };

	const onInputChanged = (newInput: string | number | boolean): void => {
		let finalValue: string | number | boolean = newInput;
		if (nodeInput.type === NodeInputType.BOOLEAN) {
			finalValue = !inputValue;
		}
		setInputValue(finalValue);
		onEdit(nodeInput.resieName, finalValue);
	};

	const getInputFieldByType = (): React.ReactNode => {
		switch (js_type) {
			case NodeInputType.STRING:
				return (
					<FloatingLabel controlId="floatingInput" label={displayName}>
						<Form.Control
							type="text"
							as="textarea"
							style={{ height: '60px' }}
							placeholder={displayName}
							value={String(inputValue)}
							autoFocus
							onChange={(e) => onInputChanged(e.target.value)}
						/>
					</FloatingLabel>
				);
			case NodeInputType.NUMBER:
				return (
					<FloatingLabel controlId="floatingInput" label={displayName}>
						<Form.Control
							type="number"
							placeholder={displayName}
							value={String(inputValue)}
							onChange={(e) => onInputChanged(e.target.value)}
						/>
					</FloatingLabel>
				);
			case NodeInputType.BOOLEAN:
				return (
					<Form.Check
						type="switch"
						id={displayName}
						label={displayName}
						defaultChecked={Boolean(inputValue)}
						onChange={(e) => onInputChanged(e.target.checked)}
					/>
				);
			case NodeInputType.DROPDOWN:
				return (
					<CustomDropdown
						displayName={displayName}
						startValue={startValue}
						dropdown_options={nodeInputCopy.dropdownOptions}
						dropdown_options_display_names={nodeInputCopy.dropdownOptionDisplayNames}
						onEdit={onInputChanged}
					/>
				);
			// case NodeInputType.MEDIUM:
			// 	return (
			// 		<CustomDropdown
			// 			displayName={displayName}
			// 			startValue={startValue}
			// 			dropdown_options={mediums.map((m: any) => m.key)}
			// 			dropdown_options_display_names={mediums.map((m: any) => m.name)}
			// 			onEdit={onInputChanged}
			// 		/>
			// 	);
			default:
				console.log('Input ' + displayName + ' has type that is not defined yet.');
				return null;
		}
	};

	return (
		<div data-toggle="tooltip" data-placement="top" title={nodeInput.tooltip}>
			{getInputFieldByType()}
		</div>
	);
};

export default CustomInputField;
