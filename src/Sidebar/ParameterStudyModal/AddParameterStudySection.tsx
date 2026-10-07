import { useState } from 'react';
import CustomDropdown from '../../Reactflow-Components/CustomInputWidgets/CustomDropdown';
import { UacWidget } from '../../Reactflow-Components/CustomInputWidgets/UacWidget';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import { useReactFlow } from '@xyflow/react';
import { Button } from 'react-bootstrap';

export function AddParameterStudySection({
	addParameterStudy,
}: {
	addParameterStudy: (nodeId: string, resieName: string) => void;
}) {
	const [nodeId, setNodeId] = useState<string>('');
	const [inputResieName, setInputResieName] = useState<string>('');
	const allNodes: SusiNode[] = useReactFlow().getNodes() as SusiNode[];
	const selectedNode = nodeId === '' ? undefined : allNodes.find((n) => n.id === nodeId);
	const input = selectedNode ? selectedNode.data.nodeInputs.find((e) => e.resieName === inputResieName) : undefined;

	return (
		<div>
			<UacWidget displayName="Component" value={nodeId} onInputChanged={setNodeId} excludedNodeIds={[]} />
			{selectedNode && (
				<CustomDropdown
					displayName="Input to study"
					startValue={inputResieName}
					onEdit={setInputResieName}
					dropdown_options={selectedNode.data.nodeInputs.map((input) => input.resieName)}
					dropdown_options_display_names={selectedNode.data.nodeInputs.map((input) => input.displayName)}
				/>
			)}
			{input && <Button onClick={() => addParameterStudy(nodeId, inputResieName)}>Add Parameter</Button>}
		</div>
	);
}
