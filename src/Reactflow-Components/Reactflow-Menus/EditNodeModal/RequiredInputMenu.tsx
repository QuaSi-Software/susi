import { Row, Col } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import CustomInputField from '../../CustomInputWidgets/CustomInputField';
import type { NodeInput } from '../../../NodeDataStructures/Nodes/NodeInput';
import React from 'react';

interface RequiredInputMenuProps {
	requiredInputObjects: NodeInput[];
	onEdit: (resieName: string, newValue: string | number | boolean) => void;
}

const RequiredInputMenu: React.FC<RequiredInputMenuProps> = ({ requiredInputObjects, onEdit }) => {
	/**
	 * Divide up the Node inputs into Lists that are displayed in one row
	 * @param items_per_row how many input fields should there be in each row
	 * @returns List of rows, each containing NodeInput items
	 */
	const chunk_into_rows = (items_per_row: number): Array<Array<NodeInput>> => {
		const rows: Array<Array<NodeInput>> = [];
		let current_row: Array<NodeInput> = [];
		requiredInputObjects.forEach((node_input) => {
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

	if (requiredInputObjects.length === 0) return <></>;
	const rows = chunk_into_rows(2);
	return (
		<>
			<Modal.Body className="side-padded-menu">
				<Modal.Header>Required Inputs</Modal.Header>
				{rows.map((pair, pairIndex) => (
					<Row key={pairIndex} className="g-2 mt-1 mt-md-0">
						{pair.map((nodeInput) => (
							<Col key={nodeInput.resieName} md>
								<CustomInputField nodeInput={nodeInput} onEdit={onEdit} />
							</Col>
						))}
					</Row>
				))}
			</Modal.Body>
		</>
	);
};

export default RequiredInputMenu;
