import { Row, Col } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import CustomInputField from './CustomInputField';
import type { InputObject } from './InputObject';
import React from 'react';
import OptionalInputField from './OptionalInputField';

interface InputMenuProps {
	title: string;
	inputs: InputObject[];
	onValueChange: (resieName: string, newValue: string | number | boolean) => void;
	onIncludedChange: (resieName: string, isIncluded: boolean) => void;
	numberOfColumns: number;
}

/**
 * Divide up the Node inputs into Lists that are displayed in one row
 * @param items_per_row how many input fields should there be in each row
 * @returns List of rows, each containing NodeInput items
 */
const chunk_into_rows = (inputs: InputObject[], items_per_row: number): Array<Array<InputObject>> => {
	const rows: InputObject[][] = [];
	let current_row: Array<InputObject> = [];
	inputs.forEach((node_input) => {
		if (!node_input.editable) return;
		current_row.push(node_input);
		if (current_row.length === items_per_row) {
			rows.push(current_row);
			current_row = [];
		}
	});
	if (current_row.length > 0) {
		rows.push(current_row);
	}
	return rows;
};

const InputMenu: React.FC<InputMenuProps> = ({ title, inputs, onValueChange, onIncludedChange, numberOfColumns }) => {
	if (inputs.length === 0) return <></>;
	const rows = chunk_into_rows(inputs, numberOfColumns);

	return (
		<>
			<Modal.Body className="side-padded-menu" key={title}>
				<Modal.Header>{title}</Modal.Header>
				{rows.map((pair, pairIndex) => (
					<Row key={pairIndex} className="g-2 mt-1 mt-md-0">
						{pair.map((input) => (
							<Col key={input.resieName} md>
								{input.isRequired && <CustomInputField nodeInput={input} onEdit={onValueChange} />}
								{!input.isRequired && (
									<OptionalInputField
										key={input.resieName}
										nodeInput={input}
										onValueChange={onValueChange}
										startIncluded={input.isIncluded}
										onIncludedChange={onIncludedChange}
									/>
								)}
							</Col>
						))}
					</Row>
				))}
			</Modal.Body>
		</>
	);
};

export default InputMenu;
