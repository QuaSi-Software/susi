import React from 'react';
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

	const onChange = (color: string | null, name: string | null) => {
		if (color !== null) medium.color = color;
		if (name !== null) medium.name = name;
		onMediumChange(medium);
	};

	return (
		<Row className="align-items-center g-2 medium-input-row">
			<Col xs="auto">
				<PopoverPicker color={medium.color} onChange={onMediumColorChange} />
			</Col>
			<Col>
				<Form.Control
					type="text"
					placeholder="Medium name"
					value={medium.name}
					onChange={(e) => onMediumNameChange(e.target.value)}
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
