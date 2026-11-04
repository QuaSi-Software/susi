import type { Medium } from '../../../NodeDataStructures/Mediums/Medium';
import type { SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';
import type { InputObject } from '../../../Reactflow-Components/CustomInputWidgets/InputObject';
import { InputIssueType } from '../../../Reactflow-Components/CustomInputWidgets/Validation/InputChecking';

function getNodeNameFromID(nodeID: string, nodes: SusiNode[]) {
	return nodes.find((n) => n.id === nodeID)!.data.content;
}

const addNodeInputsToObject = (
	nodeInputs: InputObject[],
	mediums: Medium[],
	nodes: SusiNode[],
	obj: Record<string, any> = {}
): Record<string, any> => {
	nodeInputs.forEach((nodeInput) => {
		if (!nodeInput.isIncluded && !nodeInput.isRequired) {
			return;
		}
		const issueType = nodeInput.issue.issueType;
		if (issueType === InputIssueType.Conditional || issueType === InputIssueType.Mutex) return;
		obj[nodeInput.resieName] = nodeInput.getNodeInputExportValue(mediums, nodes);
	});
	return obj;
};

export { addNodeInputsToObject, getNodeNameFromID };
