import type { Edge } from '@xyflow/react';
import type { NodeWithSusiData } from '../../NodeDataStructures/NodeWithSusiData';
import type { Medium } from '../../NodeDataStructures/Medium';

interface ImportStateProps {
	stateJSON: string;
	setNodes: (nodes: NodeWithSusiData[]) => void;
	setEdges: (edges: Edge[]) => void;
	setMediums: (mediums: Medium[]) => void;
	logError: (errorMessage: string) => void;
}

const importState = ({ stateJSON, setNodes, setEdges, setMediums, logError }: ImportStateProps): void => {
	/** set the nodes, edges, and mediums from the imported state JSON */
	console.log('Import file');
};

export default importState;
