import { useState } from 'react';
import CustomDropdown from '../../Reactflow-Components/CustomInputWidgets/CustomDropdown';
import { UacWidget } from '../../Reactflow-Components/CustomInputWidgets/UacWidget';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import { useReactFlow } from '@xyflow/react';
import { Button } from 'react-bootstrap';
import type { ParameterStudy } from './ParameterStudyModal';
import { ComponentInputType, getInputs } from '../../NodeDataStructures/Nodes/ComponentInputTypes';

interface Props {
	addParameterStudy: (nodeId: string, inputType: ComponentInputType, resieName: string) => void;
	parameterStudies: ParameterStudy[];
}

export function AddParameterStudySection({ addParameterStudy, parameterStudies }: Props) {
	const [nodeId, setNodeId] = useState<string>('');
	const allNodes: SusiNode[] = useReactFlow().getNodes() as SusiNode[];
	const selectedNode = nodeId === '' ? undefined : allNodes.find((n) => n.id === nodeId);
	/** Get input type options */
	const inputTypeOptions: ComponentInputType[] = [ComponentInputType.PARAMETER];
	if (selectedNode?.data.economicInputs && selectedNode!.data.economicInputs.length > 0)
		inputTypeOptions.push(ComponentInputType.ECONOMIC);
	if (selectedNode?.data.emissionsInputs && selectedNode!.data.emissionsInputs.length > 0)
		inputTypeOptions.push(ComponentInputType.EMISSIONS);

	const [inputType, setInputType] = useState<ComponentInputType>(inputTypeOptions[0]);
	const [inputResieName, setInputResieName] = useState<string>('');
	const inputs = selectedNode ? getInputs(inputType, selectedNode) : [];
	const addButtonWarning = getWarning();

	function getWarning(): string {
		if (!selectedNode) return 'No Component Selected';
		const duplicate = parameterStudies.find(
			(e) => e.nodeId === nodeId && e.resieName === inputResieName && e.inputType === inputType
		);
		if (duplicate !== undefined) return 'Parameter is already in List.';
		return '';
	}

	function onSetInputType(type: ComponentInputType) {
		setInputType(type);
		if (selectedNode) {
			const inputs = getInputs(type, selectedNode);
			setInputResieName(inputs[0].resieName);
		}
	}
	function onSetNodeId(id: string) {
		setNodeId(id);
		const node = allNodes.find((e) => e.id === id)!;
		setInputType(ComponentInputType.PARAMETER);
		if (node) {
			const inputs = getInputs(ComponentInputType.PARAMETER, node);
			setInputResieName(inputs[0].resieName);
		}
	}

	return (
		<div className="add-parameter-study-section">
			<div className="modal-subheading">Add Parameter Study</div>
			<div className="parameter-study-buttons">
				<div>
					<UacWidget
						displayName="Component"
						value={nodeId}
						onInputChanged={onSetNodeId}
						excludedNodeIds={[]}
					/>
				</div>
				<div style={{ visibility: selectedNode ? 'visible' : 'hidden' }}>
					<CustomDropdown
						displayName="Type of Parameter"
						startValue={inputType}
						onEdit={onSetInputType}
						dropdown_options={inputTypeOptions}
						dropdown_options_display_names={inputTypeOptions}
					/>
				</div>
				<div style={{ visibility: selectedNode ? 'visible' : 'hidden' }}>
					<CustomDropdown
						displayName="Input to study"
						startValue={inputResieName}
						onEdit={setInputResieName}
						dropdown_options={inputs.map((input) => input.resieName) ?? []}
						dropdown_options_display_names={inputs.map((input) => input.displayName)}
					/>
				</div>
				<span title={addButtonWarning}>
					<Button
						disabled={addButtonWarning !== ''}
						onClick={() => addParameterStudy(nodeId, inputType, inputResieName)}
					>
						Add Parameter
					</Button>
				</span>
			</div>
		</div>
	);
}
