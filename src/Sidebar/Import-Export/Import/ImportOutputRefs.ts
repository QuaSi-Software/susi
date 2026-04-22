import { NodeInputType } from '../../../NodeDataStructures/NodeInput';
import type { NodeWithSusiData } from '../../../NodeDataStructures/NodeWithSusiData';
import type { ComponentData, ConnectionHandles } from '../ExportDataStrucures';

export default function getOutputRefs(
	nodeData: ComponentData,
	node: NodeWithSusiData,
	logError: (errorMessage: string) => void
): string[] {
	if (nodeData.import_data!.node_type!.toLowerCase() === 'bus') {
		return nodeData.connections?.output_order || [];
	}

	const outputRefs = nodeData.output_refs;
	if (Array.isArray(outputRefs)) {
		return outputRefs;
	}

	if (!outputRefs || typeof outputRefs !== 'object') {
		logError(`Node ${node.data.content} has no output_refs or connections.output_order`);
		return [];
	}

	/** Use the medium data to generate connection handles */
	const mediumNodeInputs = node.data.nodeInputs.filter((e) => e.type === NodeInputType.MEDIUM);
	/** If there is only one medium, then the connection order doesn't matter */
	if (mediumNodeInputs.length === 0) return Object.values(outputRefs) as string[];

	/** Use the medium variable name (key in the output_refs dictionary)  and the nodes mediumHandleDict
	 * to determine which handle its edge should connect to */
	const outputRefArray = [];
	const connectionHandles: ConnectionHandles[] = [];
	// for each node in output_refs, find which handle it should be on given its specified medium variable
	for (const [mediumVarName, nodeID] of Object.entries(outputRefs)) {
		const handleIndex = node.data.handleMediumDict.source.findIndex((e) => e === mediumVarName);
		outputRefArray.push(nodeID);
		connectionHandles.push({ source: handleIndex });
	}
	nodeData.import_data!.connection_handles = connectionHandles;
	return outputRefArray;
}
