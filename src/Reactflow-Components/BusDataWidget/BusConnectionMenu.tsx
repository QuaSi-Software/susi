import DragAndDropMenu from './DragAndDropMenu';
import { Col, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import EnergyFlowMatrix from './EnergyFlowMatrix';
import type BusData from '../../NodeDataStructures/BusData';
import React from 'react';
import type { NodeWithSusiData } from '../../NodeDataStructures/NodeWithSusiData';

interface BusConnectionMenuProps {
	node: NodeWithSusiData;
	nodes: NodeWithSusiData[];
	onBusDataChange: (busData: BusData) => void;
}

/**
 * Get a list of all the node names for a list of node IDs
 * @param nodeIDs a list of node IDs (strings)
 * @param allNodes A list of all the nodes in the scene
 * @returns A list of node names (string)
 */
function getNodeNamesFromIDs(nodeIDs: string[], allNodes: NodeWithSusiData[]): string[] {
	const nodes = nodeIDs.map((id) => allNodes.find((n) => n.id === id));
	const nodeNames = nodes.map((node) => (node ? node.data.content : ''));
	return nodeNames;
}

/**
 * Take a list of node names and return a list of the node IDs
 * @param names A list of the node names (string)
 * @param allNodes A list of all nodes in the scene
 * @returns list of node IDs (string)
 */
function getNodeIDsFromNames(names: string[], allNodes: NodeWithSusiData[]): string[] {
	return names.map((name) => {
		const found = allNodes.find((node) => node.data.content === name);
		return found ? found.id : '';
	});
}

const BusConnectionMenu: React.FC<BusConnectionMenuProps> = ({ node, nodes, onBusDataChange }) => {
	if (node.data.componentType.toLowerCase() !== 'bus') return <></>;
	const busData = node.data.busData;
	if (!busData || busData.inputOrder.length === 0 || busData.outputOrder.length === 0) return <></>;

	/**
	 * Turn the list of node names to a list of node IDs and update the node data input_order
	 * @param names The list of node names in the input_order
	 */
	const onInputOrderChange = (names: string[]): void => {
		const inputOrder = getNodeIDsFromNames(names, nodes);
		busData.setInputOrder(inputOrder);
		onBusDataChange(busData);
	};

	/**
	 * Turn the list of node names to a list of node IDs and update the node data output_order
	 * @param names The list of node names in the output_order
	 */
	const onOutputOrderChange = (names: string[]): void => {
		const order = getNodeIDsFromNames(names, nodes);
		busData.setOutputOrder(order);
		onBusDataChange(busData);
	};

	/**
	 * Update the energy flow matrix in the node data
	 * @param energyFlow The new energy flow integer matrix
	 */
	const onEnergyFlowChange = (energyFlow: number[][]): void => {
		busData.energyFlow = energyFlow;
		onBusDataChange(busData);
	};

	return (
		<>
			<Modal.Body className="side-padded-menu">
				<Modal.Header>Priorities</Modal.Header>
				<Row className="g-2 mt-1 mt-md-0">
					<Col md>
						<DragAndDropMenu
							title="Input Order"
							nodeNames={getNodeNamesFromIDs(busData.inputOrder, nodes)}
							onOrderChange={onInputOrderChange}
						/>
					</Col>
					<Col md>
						<DragAndDropMenu
							title="Output Order"
							nodeNames={getNodeNamesFromIDs(busData.outputOrder, nodes)}
							onOrderChange={onOutputOrderChange}
						/>
					</Col>
				</Row>
			</Modal.Body>

			<Modal.Body>
				<Modal.Header>Energy Flow Matrix</Modal.Header>
				<EnergyFlowMatrix
					input_order={getNodeNamesFromIDs(busData.inputOrder, nodes)}
					output_order={getNodeNamesFromIDs(busData.outputOrder, nodes)}
					initialEnergyFlow={busData.energyFlow}
					onEnergyFlowChange={onEnergyFlowChange}
				/>
			</Modal.Body>
		</>
	);
};

export default BusConnectionMenu;
