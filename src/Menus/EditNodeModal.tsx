import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import type { Edge } from '@xyflow/react';
import type { NodeWithSusiData } from '../Nodes/CreateNode';

// import ResieInputMenu from './ResieInputMenu/ResieInputMenu';
// import { getEdgesWithMediumMismatch } from '../HandleUtils';
// import { getEmptyBusdata, updateBusDataOnNodeDelete, updateBusDataOnEdgeDelete } from './BusDataWidget/BusDataUtils';

interface EditNodeModalInputs {
	show: boolean;
	node: NodeWithSusiData;
	handleClose: () => void;
	nodes: NodeWithSusiData[];
	setNodes: (nodes: NodeWithSusiData[]) => void;
	edges: Edge[];
	setEdges: (edges: Edge[]) => void;
}

const EditNodeModal = ({
	show,
	node,
	handleClose,
	nodes,
	setNodes,
	// setEdges,
	// edges,
}: EditNodeModalInputs) => {
	const [editedNode, setEditedNode] = useState(node);
	// const [edgesToDelete, setEdgesToDelete] = useState([]);

	const onNodeContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedNode((editedNode: NodeWithSusiData) => ({
			...editedNode,
			data: { ...editedNode.data, content: e.target.value },
		}));
	};

	// const onNodeInputValueChange = (key: string, newValue: any) => {
	// 	changeNodeInput(key, 'value', newValue);
	// };
	// const onNodeInputIncludedChange = (key: string, isIncluded: boolean) => {
	// 	changeNodeInput(key, 'isIncluded', isIncluded);
	// };
	// const changeNodeInput = (resieName: string, inputAttributeName: string, value: any) => {
	// 	//change node input
	// 	//if you don't make a copy, the change to the resie_data is applied to the nodes list, since editedNode is a reference, not a copy
	// 	const resie_data_copy = JSON.parse(JSON.stringify(editedNode.data.resie_data));
	// 	let node_input = resie_data_copy.find((obj: NodeInput) => obj.resieName === resieName);
	// 	node_input[inputAttributeName] = value;
	// 	setEditedNode((editedNode: NodeWithSusiData) => ({
	// 		...editedNode,
	// 		data: { ...editedNode.data, resie_data: resie_data_copy },
	// 	}));
	// 	// remove edge if the medium change necessitates it
	// 	// let newEdgesToDelete = getEdgesWithMediumMismatch(edges, editedNode, resieName);
	// 	// newEdgesToDelete = newEdgesToDelete.concat(edgesToDelete);
	// 	// setEdgesToDelete(newEdgesToDelete);
	// };
	// const onNodeBusDataChange = (busData) => {
	// 	setEditedNode((editedNode : Node) => ({ ...editedNode, data: { ...editedNode.data, bus_data: busData } }));
	// };

	const handleSaveChanges = () => {
		let updatedNodes = nodes.map((n: NodeWithSusiData) => (n.id === editedNode.id ? editedNode : n));
		// edgesToDelete.forEach((edgeID) => {
		// 	const edge = edges.find((e) => e.id === edgeID);
		// 	updateBusDataOnEdgeDelete(updatedNodes, edge);
		// });
		setNodes(updatedNodes);
		// const updatedEdges = edges.filter((edge: Edge) => edgesToDelete.findIndex((e) => e === edge.id) === -1);
		// setEdges(updatedEdges);
		// setNodeContextMenu(null);
		handleClose();
	};

	return (
		<>
			<Modal show={show} onHide={handleClose} onExited={handleClose}>
				<Modal.Header closeButton style={{ padding: '20px 10%' }}>
					<Modal.Title>Edit Node</Modal.Title>
				</Modal.Header>
				<Modal.Body className="side-padded-menu">
					<Row className="g-2">
						<Col md>
							<FloatingLabel controlId="floatingInput" label="Node Content">
								<Form.Control
									type="text"
									as="textarea"
									style={{ height: '100px' }}
									placeholder="nodeContent"
									value={editedNode.data.content}
									autoFocus
									onChange={onNodeContentChange}
								/>
							</FloatingLabel>
						</Col>
					</Row>
				</Modal.Body>
				{/* <ResieInputMenu
				node={editedNode}
				nodes={nodes}
				onValueChange={onNodeInputValueChange}
				onIncludedChange={onNodeInputIncludedChange}
				onBusDataChange={onNodeBusDataChange}
                /> */}
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={handleSaveChanges}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default EditNodeModal;
