import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import _ from 'lodash';

import type { NodeWithSusiData } from '../../../NodeDataStructures/NodeWithSusiData';
import type BusData from '../../../NodeDataStructures/BusData';
import type { NodeInput } from '../../../NodeDataStructures/NodeInput';
import ResieInputMenu from './ResieInputMenu';
import { getEdgesWithMediumMismatch } from '../../../Sidebar/Mediums/MediumUtils';
import { updateBusDataOnEdgeDelete } from '../../BusDataWidget/BusDataUtils';
import type { SusiEdge } from '../../../NodeDataStructures/SusiEdgeData';

interface EditNodeModalInputs {
	show: boolean;
	node: NodeWithSusiData;
	nodes: NodeWithSusiData[];
	setNodes: (nodes: NodeWithSusiData[]) => void;
	edges: SusiEdge[];
	setEdges: (edges: SusiEdge[]) => void;
	handleClose: () => void;
}

const EditNodeModal = ({ show, node, handleClose, nodes, setNodes, setEdges, edges }: EditNodeModalInputs) => {
	const [editedNode, setEditedNode] = useState(node);
	const [edgesToDelete, setEdgesToDelete] = useState<string[]>([]);

	const onNodeContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditedNode((editedNode: NodeWithSusiData) => ({
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
		const resieDataCopy: Array<NodeInput> = Object.assign([], editedNode.data.nodeInputs);
		let nodeInput = resieDataCopy.find((obj: NodeInput) => obj.resieName === resieName);
		console.assert(nodeInput != undefined);
		if (isValueChange) {
			nodeInput!.value = value;
		} else {
			nodeInput!.isIncluded = value;
		}
		setEditedNode((editedNode: NodeWithSusiData) => ({
			...editedNode,
			data: { ...editedNode.data, nodeInputs: resieDataCopy },
		}));
		// remove edge if the medium change necessitates it
		let newEdgesToDelete = getEdgesWithMediumMismatch(edges, editedNode, resieName);
		newEdgesToDelete = newEdgesToDelete.concat(edgesToDelete);
		setEdgesToDelete(newEdgesToDelete);
	};
	const onNodeBusDataChange = (busData: BusData) => {
		setEditedNode((editedNode: NodeWithSusiData) => ({
			...editedNode,
			data: { ...editedNode.data, busData: busData },
		}));
	};

	const handleSaveChanges = () => {
		let updatedNodes = nodes.map((n: NodeWithSusiData) => (n.id === editedNode.id ? editedNode : n));
		edgesToDelete.forEach((edgeID) => {
			const edge = edges.find((e) => e.id === edgeID);
			updateBusDataOnEdgeDelete(updatedNodes, edge!);
		});
		setNodes(updatedNodes);
		const updatedEdges = edges.filter((edge: SusiEdge) => edgesToDelete.findIndex((e) => e === edge.id) === -1);
		setEdges(updatedEdges);
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
				<ResieInputMenu
					node={editedNode}
					nodes={nodes}
					onValueChange={onNodeInputValueChange}
					onIncludedChange={onNodeInputIncludedChange}
					onBusDataChange={onNodeBusDataChange}
				/>
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
