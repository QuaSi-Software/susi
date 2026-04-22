import type { Medium } from '../../NodeDataStructures/Medium';
import type { NodeWithSusiData } from '../../NodeDataStructures/NodeWithSusiData';
import type { SusiEdge } from '../../NodeDataStructures/SusiEdgeData';

interface ExportProps {
	nodes: NodeWithSusiData[];
	edges: SusiEdge[];
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
