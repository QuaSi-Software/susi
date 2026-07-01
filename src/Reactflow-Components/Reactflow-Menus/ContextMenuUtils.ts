import type { Dispatch, SetStateAction } from 'react';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import type { SusiEdge } from '../../NodeDataStructures/Edges/SusiEdge';
import { updateBusDataOnNodeDelete } from '../../NodeDataStructures/Bus/BusDataUtils';

function deleteNode(
	node: SusiNode,
	// allNodes: SusiNode[],
	allEdges: SusiEdge[],
	setNodes: Dispatch<SetStateAction<SusiNode[]>>,
	setEdges: Dispatch<SetStateAction<SusiEdge[]>>
) {
	if (node.deletable) {
		setNodes((nodes) => {
			const updatedNodes = nodes.filter((e) => e.id !== node.id);
			updateBusDataOnNodeDelete(node.id, nodes, allEdges);
			return updatedNodes;
		});
		setEdges((edges) => {
			const updatedEdges = edges.filter((edge) => edge.source !== node.id && edge.target !== node.id);
			return updatedEdges;
		});
	}
}

export { deleteNode };
