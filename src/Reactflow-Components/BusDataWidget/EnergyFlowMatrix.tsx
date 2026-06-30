import { Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import React from 'react';

interface EnergyFlowMatrixProps {
	initialEnergyFlow: Array<Array<number>>;
	input_order: string[];
	output_order: string[];
	onEnergyFlowChange: (energyFlow: Array<Array<number>>) => void;
}

const EnergyFlowMatrix: React.FC<EnergyFlowMatrixProps> = ({
	initialEnergyFlow,
	input_order,
	output_order,
	onEnergyFlowChange,
}) => {
	const [energyFlow, setEnergyFlow] = useState<Array<Array<number>>>(initialEnergyFlow);

	// update the energy flow, so changes from outside the component are still displayed correctly
	useEffect(() => {
		setEnergyFlow(initialEnergyFlow);
	}, [initialEnergyFlow]);

	/**
	 * update the energy flow matrix with the value change
	 * both in the component state and in the node array
	 * @param row the row the edited element is in
	 * @param col the col the edited element is in
	 * @param value the new value of the element as a string
	 */
	const onInputChange = (row: number, col: number, value: string): void => {
		const newEnergyFlow = JSON.parse(JSON.stringify(energyFlow)) as Array<Array<number>>;
		newEnergyFlow[row][col] = parseInt(value, 10);
		setEnergyFlow(newEnergyFlow);
		onEnergyFlowChange(newEnergyFlow);
	};

	return (
		<>
			<table className="table">
				<thead>
					<tr>
						<th scope="col">#</th>
						{output_order.map((node_id) => (
							<th key={node_id} scope="col">
								{node_id}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{input_order.map((node_id, row) => (
						<tr key={node_id}>
							<th scope="row">{node_id}</th>
							{energyFlow[row].map((element, col) => (
								<td key={`energy-flow-element-${row}-${col}`}>
									<Form.Control
										type="number"
										value={element}
										onChange={(e) => onInputChange(row, col, e.target.value)}
									/>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};

export default EnergyFlowMatrix;
