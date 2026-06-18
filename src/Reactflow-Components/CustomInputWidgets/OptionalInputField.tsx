import { Row, Col, Form } from 'react-bootstrap';
import CustomInputField from './CustomInputField';
import { useState } from 'react';
import React from 'react';
import type { InputObject } from './InputObject';
import { InputIssueType } from './Validation/InputChecking';

interface OptionalInputFieldProps {
	nodeInput: InputObject;
	onValueChange: (resieName: string, newValue: string | number | boolean) => void;
	startIncluded: boolean;
	onIncludedChange: (resieName: string, isIncluded: boolean) => void;
}

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

	const onValueFieldEdit = (key: string, newValue: string | number | boolean): void => {
		setIncluded(true);
		onIncludedChange(resieName, true);
		onValueChange(key, newValue);
	};

	return (
		<Row className="g-2 mt-1 mt-md-0 optional-input-row">
			<Col className="optional-input-checkbox">
				<Form.Check
					type="switch"
					checked={isIncluded}
					id={resieName}
					label="include"
					onChange={onSwitchClicked}
					isInvalid={nodeInput.issue.issueType === InputIssueType.AtLeastOne}
					disabled={nodeInput.issue.issueType === InputIssueType.Mutex}
				/>
			</Col>
			<Col className="optional-input-input-field">
				<CustomInputField nodeInput={nodeInput} onEdit={onValueFieldEdit} />
			</Col>
		</Row>
	);
};

export default OptionalInputField;
