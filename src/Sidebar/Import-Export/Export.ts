import type { Edge } from '@xyflow/react';
import type { Medium } from '../../NodeDataStructures/Medium';
import type { NodeWithSusiData } from '../../NodeDataStructures/NodeWithSusiData';

interface ExportProps {
	nodes: NodeWithSusiData[];
	edges: Edge[];
	mediums: Medium[];
}

const exportState = ({ nodes, edges, mediums }: ExportProps): string => {
	return JSON.stringify({
		nodes: nodes,
		edges: edges,
		mediums: mediums,
	});
};

export default exportState;
