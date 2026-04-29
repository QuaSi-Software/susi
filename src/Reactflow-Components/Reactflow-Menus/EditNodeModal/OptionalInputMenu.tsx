import { Row, Col, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import CustomInputField from '../../CustomInputWidgets/CustomInputField';
import { useState } from 'react';
import type { NodeInput } from '../../../NodeDataStructures/NodeInput';
import React from 'react';

interface OptionalInputMenuProps {
	optionalInputObjects: NodeInput[];
	onValueChange: (resieName: string, newValue: string | number | boolean) => void;
	onIncludedChange: (resieName: string, isIncluded: boolean) => void;
}

interface OptionalInputFieldProps {
	nodeInput: NodeInput;
	onValueChange: (resieName: string, newValue: string | number | boolean) => void;
	startIncluded: boolean;
	onIncludedChange: (resieName: string, isIncluded: boolean) => void;
}

const OptionalInputMenu: React.FC<OptionalInputMenuProps> = ({
	optionalInputObjects,
	onValueChange,
	onIncludedChange,
}) => {
	if (optionalInputObjects.length === 0) return <></>;

	return (
		<>
			<Modal.Body className="side-padded-menu">
				<Modal.Header>Optional Inputs</Modal.Header>
				{optionalInputObjects.map((nodeInput) => (
					<OptionalInputField
						key={nodeInput.resieName}
						nodeInput={nodeInput}
						onValueChange={onValueChange}
						startIncluded={nodeInput.isIncluded}
						onIncludedChange={onIncludedChange}
					/>
				))}
			</Modal.Body>
		</>
	);
};

const OptionalInputField: React.FC<OptionalInputFieldProps> = ({
	nodeInput,
	onValueChange,
	startIncluded,
	onIncludedChange,
}) => {
	const resieName = nodeInput.resieName;
	const [isIncluded, setIncluded] = useState<boolean>(startIncluded);

	const onSwitchClicked = (): void => {
		setIncluded(!isIncluded);
		onIncludedChange(resieName, !isIncluded);
	};

	const onValueFieldEdit = (newValue: string | number | boolean): void => {
		setIncluded(true);
		onIncludedChange(resieName, true);
		onValueChange(resieName, newValue);
	};

	return (
		<Row className="g-2 mt-1 mt-md-0 optional-input-row">
			<Col className="optional-input-checkbox">
				<Form.Check
					type="switch"
					checked={isIncluded}
					id={resieName}
					label="include?"
					defaultChecked={isIncluded}
					onChange={onSwitchClicked}
				/>
			</Col>
			<Col className="optonal-input-input-field">
				<CustomInputField nodeInput={nodeInput} onEdit={onValueFieldEdit} />
			</Col>
		</Row>
	);
};

export default OptionalInputMenu;
