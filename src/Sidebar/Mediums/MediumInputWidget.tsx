import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import type { Medium } from '../../NodeDataStructures/Mediums/Medium';
import { PopoverPicker } from './ColorPicker/PopoverPicker';

interface MediumInputWidgetProps {
	medium: Medium;
	onMediumChange: (medium: Medium) => void;
	onDelete: () => void;
}

const MediumInputWidget: React.FC<MediumInputWidgetProps> = ({ medium, onMediumChange, onDelete }) => {
	const onMediumColorChange = (color: string) => onChange(color, null);
	const onMediumNameChange = (name: string) => onChange(null, name);
	const [currentName, setCurrentName] = useState<string>(medium.name);

	const onChange = (color: string | null, name: string | null) => {
		if (color !== null) medium.color = color;
		if (name !== null) medium.name = name;
		onMediumChange(medium);
	};

	useEffect(() => {
		const timeoutId = setTimeout(() => onMediumNameChange(currentName), 300);
		return () => clearTimeout(timeoutId);
	}, [currentName]);
	useEffect(() => {
		setCurrentName(medium.name);
	}, [medium.name]);

	return (
		<Row className="align-items-center g-2 medium-input-row">
			<Col xs="auto">
				<PopoverPicker color={medium.color} onChange={onMediumColorChange} />
			</Col>
			<Col>
				<Form.Control
					type="text"
					placeholder="Medium name"
					value={currentName}
					onChange={(e) => setCurrentName(e.target.value)}
					isInvalid={!medium.valid}
				/>
			</Col>
			<Col xs="auto">
				<Button variant="danger" size="sm" onClick={onDelete}>
					Delete
				</Button>
			</Col>
		</Row>
	);
};

export default MediumInputWidget;
