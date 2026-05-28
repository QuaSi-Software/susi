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
import InputMenu from '../CustomInputWidgets/InputMenu';
import BusConnectionMenu from '../BusDataWidget/BusConnectionMenu';
import { AppContext } from '../../AppContext';

interface EditNodeModalInputs {
	show: boolean;
	node: SusiNode;
	nodes: SusiNode[];
	setNodes: (nodes: SusiNode[]) => void;
	edges: SusiEdge[];
	setEdges: (edges: SusiEdge[]) => void;
	handleClose: () => void;
}

const EditNodeModal = ({ show, node, handleClose, nodes, setNodes, setEdges, edges }: EditNodeModalInputs) => {
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

	const onNodeInputValueChange = (key: string, newValue: any) => {
		changeNodeInput(key, newValue, true);
	};
	const onNodeInputIncludedChange = (key: string, isIncluded: boolean) => {
		changeNodeInput(key, isIncluded, false);
	};
	const changeNodeInput = (resieName: string, value: any, isValueChange: boolean) => {
		//change node input
		//if you don't make a copy, the change to the resie_data is applied to the nodes list, since editedNode is a reference, not a copy
		const resieDataCopy: Array<InputObject> = Object.assign([], editedNode.data.nodeInputs);
		let nodeInput = resieDataCopy.find((obj: InputObject) => obj.resieName === resieName);
		console.assert(nodeInput != undefined);
		if (isValueChange) {
			nodeInput!.value = value;
			nodeInput!.checkInputValid(resieDataCopy);
		} else {
			nodeInput!.isIncluded = value;
		}
		/** check all conditionals */
		resieDataCopy.forEach((input) => {
			input.checkConditionals(resieDataCopy);
		});
		setEditedNode((editedNode: SusiNode) => ({
			...editedNode,
			data: { ...editedNode.data, nodeInputs: resieDataCopy },
		}));
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
		editedNode.data.hasValidInputs = true;
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
	const allInputsValid = editedNode.data.nodeInputs.every((input) => input.isValid || !input.isIncluded);
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
				</Modal.Body>
				<InputMenu
					title="Component Inputs"
					inputs={editedNode.data.nodeInputs}
					onValueChange={onNodeInputValueChange}
					onIncludedChange={onNodeInputIncludedChange}
					numberOfColumns={2}
				/>
				<BusConnectionMenu node={node} nodes={nodes} onBusDataChange={onNodeBusDataChange} />
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={handleSaveChanges} disabled={!allInputsValid || nameIsDuplicate}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default EditNodeModal;
