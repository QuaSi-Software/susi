import { useContext, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import _ from 'lodash';

import { deepCloneNode, deepCloneNodes, type SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import type BusData from '../../NodeDataStructures/Bus/BusData';
import type { InputObject } from '../CustomInputWidgets/InputObject';
import { getEdgesWithMediumMismatch } from '../../NodeDataStructures/Mediums/MediumUtils';
import { updateBusDataOnEdgeDelete } from '../../NodeDataStructures/Bus/BusDataUtils';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import BusConnectionMenu from '../BusDataWidget/BusConnectionMenu';
import { AppContext } from '../../AppContext';
import InputMenuWithCategories from '../CustomInputWidgets/InputMenuWithCategories';
import { InputMenu } from '../CustomInputWidgets/InputMenu';
import { assignInputs, ComponentInputType, getInputs } from '../../NodeDataStructures/Nodes/ComponentInputTypes';

interface EditNodeModalInputs {
	show: boolean;
	node: SusiNode;
	nodes: SusiNode[];
	setNodes: (nodes: SusiNode[]) => void;
	edges: SusiEdge[];
	setEdges: (edges: SusiEdge[]) => void;
	handleClose: () => void;
	getResieParameter: (menuName: string, inputName: string) => any;
}

const EditNodeModal = ({
	show,
	node,
	handleClose,
	nodes,
	setNodes,
	setEdges,
	edges,
	getResieParameter,
}: EditNodeModalInputs) => {
	const [editedNode, setEditedNode] = useState(deepCloneNode(node));
	const [edgesToDelete, setEdgesToDelete] = useState<string[]>([]);
	const setCheckState = useContext(AppContext)!.setCheckState;

	// Sync the edited node and reset edges to delete whenever the node prop changes or modal opens
	useEffect(() => {
		if (show) {
			setEditedNode(deepCloneNode(node));
			setEdgesToDelete([]);
		}
	}, [show, node.id]);

	const onNodeContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedNode((editedNode: SusiNode) => ({
			...editedNode,
			data: { ...editedNode.data, content: e.target.value },
		}));
	};

	const onNodeInputValueChange = (componentInputType: ComponentInputType, key: string, newValue: any) => {
		changeNodeInput(componentInputType, key, newValue, true);
	};
	const onNodeInputIncludedChange = (componentInputType: ComponentInputType, key: string, isIncluded: boolean) => {
		changeNodeInput(componentInputType, key, isIncluded, false);
	};

	const changeNodeInput = (
		componentInputType: ComponentInputType,
		resieName: string,
		value: any,
		isValueChange: boolean
	) => {
		//change node input
		//if you don't make a copy, the change to the resie_data is applied to the nodes list, since editedNode is a reference, not a copy
		const resieDataCopy: Array<InputObject> = Object.assign([], getInputs(componentInputType, editedNode));
		let nodeInput = resieDataCopy.find((obj: InputObject) => obj.resieName === resieName);
		console.assert(
			nodeInput != undefined,
			`Node Input with name ${resieName} was not found on node ${node.data.content}`
		);
		if (isValueChange) {
			nodeInput!.value = value;
		} else {
			nodeInput!.isIncluded = value;
		}
		/** check all conditionals */
		resieDataCopy.forEach((input) => {
			input.checkInputValid(resieDataCopy);
		});
		setEditedNode((editedNode: SusiNode) => {
			assignInputs(componentInputType, editedNode, resieDataCopy);
			return editedNode;
		});
		// remove edge if the medium change necessitates it
		let newEdgesToDelete = getEdgesWithMediumMismatch(edges, editedNode, resieName);
		newEdgesToDelete = newEdgesToDelete.concat(edgesToDelete);
		setEdgesToDelete(newEdgesToDelete);
	};
	const onNodeBusDataChange = (busData: BusData) => {
		setEditedNode((editedNode: SusiNode) => ({
			...editedNode,
			data: { ...editedNode.data, busData: busData },
		}));
	};

	const handleSaveChanges = () => {
		let updatedNodes = deepCloneNodes(nodes);
		editedNode.data.hasValidInputs = editedNode.data.nodeInputs.every((input) => input.isValid());
		editedNode.data.hasValidName = nodes.every(
			(node) => node.data.content !== editedNode.data.content || node.id === editedNode.id
		);
		updatedNodes = updatedNodes.map((n: SusiNode) => (n.id === editedNode.id ? editedNode : n));
		edgesToDelete.forEach((edgeID) => {
			const edge = edges.find((e) => e.id === edgeID);
			updateBusDataOnEdgeDelete(updatedNodes, edge!);
		});
		setNodes(updatedNodes);
		const updatedEdges = edges.filter((edge: SusiEdge) => edgesToDelete.findIndex((e) => e === edge.id) === -1);
		setEdges(updatedEdges);
		setCheckState(true);
		handleClose();
	};

	const nameIsDuplicate =
		nodes.find((node) => node.id !== editedNode.id && node.data.content === editedNode.data.content) !== undefined;
	const allInputsValid = editedNode.data.nodeInputs.every((input) => input.isValid());
	return (
		<>
			<Modal show={show} onHide={handleClose} onExited={handleClose}>
				<Modal.Header closeButton style={{ padding: '20px 10%' }}>
					<Modal.Title>Edit Component</Modal.Title>
				</Modal.Header>
				<Modal.Body className="side-padded-menu">
					<Row className="g-2">
						<Col md>
							<FloatingLabel controlId="floatingInput" label="Component Name">
								<Form.Control
									type="text"
									as="textarea"
									style={{ height: '100px' }}
									placeholder="Component Name"
									value={editedNode.data.content}
									onChange={onNodeContentChange}
									isInvalid={nameIsDuplicate}
								/>
							</FloatingLabel>
						</Col>
					</Row>
					<InputMenuWithCategories
						title="Component Inputs"
						inputs={editedNode.data.nodeInputs}
						inputCategories={editedNode.data.inputCategories}
						onValueChange={(resieName, newValue) => {
							onNodeInputValueChange(ComponentInputType.PARAMETER, resieName, newValue);
						}}
						onIncludedChange={(resieName, isIncluded) => {
							onNodeInputIncludedChange(ComponentInputType.PARAMETER, resieName, isIncluded);
						}}
						numberOfColumns={2}
						menuTypeName={editedNode.data.componentType}
					/>
					{getResieParameter('economic', 'calculate_economy') && (
						<InputMenu
							title="Economic"
							inputs={editedNode.data.economicInputs}
							numberOfColumns={2}
							onValueChange={(resieName, newValue) => {
								onNodeInputValueChange(ComponentInputType.ECONOMIC, resieName, newValue);
							}}
							onIncludedChange={(resieName, isIncluded) => {
								onNodeInputIncludedChange(ComponentInputType.ECONOMIC, resieName, isIncluded);
							}}
						/>
					)}
					{getResieParameter('emissions', 'calculate_emissions') && (
						<InputMenu
							title="Emissions"
							inputs={editedNode.data.emissionsInputs}
							numberOfColumns={2}
							onValueChange={(resieName, newValue) => {
								onNodeInputValueChange(ComponentInputType.EMISSIONS, resieName, newValue);
							}}
							onIncludedChange={(resieName, isIncluded) => {
								onNodeInputIncludedChange(ComponentInputType.EMISSIONS, resieName, isIncluded);
							}}
						/>
					)}

					<BusConnectionMenu node={node} nodes={nodes} onBusDataChange={onNodeBusDataChange} />
				</Modal.Body>
				<Modal.Footer>
					<span className="warning-text right-aligned-row">
						<span style={{ visibility: 'hidden' }}>Placeholder</span>
						{!allInputsValid && (
							<>
								<i className="bi bi-exclamation-circle" />
								<span> </span>
								There are issues in this file.
							</>
						)}
					</span>

					<Button variant="outline-danger" onClick={handleClose}>
						Close without Saving
					</Button>
					<Button variant="primary" onClick={handleSaveChanges} disabled={nameIsDuplicate}>
						Save Changes
						<span style={{ visibility: !allInputsValid ? 'visible' : 'hidden' }}> ⚠️ </span>
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default EditNodeModal;
