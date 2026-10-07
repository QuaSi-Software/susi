import { useState } from 'react';
import CustomDropdown from '../../Reactflow-Components/CustomInputWidgets/CustomDropdown';
import { UacWidget } from '../../Reactflow-Components/CustomInputWidgets/UacWidget';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import { useReactFlow } from '@xyflow/react';
import { Button } from 'react-bootstrap';
import type { ParameterStudy } from './ParameterStudyModal';

interface Props {
	addParameterStudy: (nodeId: string, resieName: string) => void;
	parameterStudies: ParameterStudy[];
}

export function AddParameterStudySection({ addParameterStudy, parameterStudies }: Props) {
	const [nodeId, setNodeId] = useState<string>('');
	const [inputResieName, setInputResieName] = useState<string>('');
	const allNodes: SusiNode[] = useReactFlow().getNodes() as SusiNode[];
	const selectedNode = nodeId === '' ? undefined : allNodes.find((n) => n.id === nodeId);

	function getWarning(): string {
		if (!selectedNode) return 'No Component Selected';
		const duplicate = parameterStudies.find((e) => e.nodeId === nodeId && e.resieName === inputResieName);
		if (duplicate !== undefined) return 'Parameter is already in List.';
		return '';
	}

	const addButtonWarning = getWarning();
	return (
		<div className="add-parameter-study-section">
			<div className="modal-subheading">Add Parameter Study</div>
			<div className="parameter-study-buttons">
				<div>
					<UacWidget
						displayName="Component"
						value={nodeId}
						onInputChanged={(id) => {
							setNodeId(id);
							const node = allNodes.find((n) => n.id === id);
							if (node) setInputResieName(node?.data.nodeInputs[0].resieName);
						}}
						excludedNodeIds={[]}
					/>
				</div>
				<div style={{ visibility: selectedNode ? 'visible' : 'hidden' }}>
					<CustomDropdown
						displayName="Input to study"
						startValue={inputResieName}
						onEdit={setInputResieName}
						dropdown_options={selectedNode?.data.nodeInputs.map((input) => input.resieName) ?? []}
						dropdown_options_display_names={selectedNode?.data.nodeInputs.map((input) => input.displayName)}
					/>
				</div>
				<span title={addButtonWarning}>
					<Button
						disabled={addButtonWarning !== ''}
						onClick={() => addParameterStudy(nodeId, inputResieName)}
					>
						Add Parameter
					</Button>
				</span>
			</div>
		</div>
	);
}
