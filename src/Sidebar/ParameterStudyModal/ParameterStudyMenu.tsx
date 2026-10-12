import { useState, type Dispatch, type SetStateAction } from 'react';
import type { InputObject } from '../../Reactflow-Components/CustomInputWidgets/InputObject';
import type { ParameterStudy } from './ParameterStudyModal';
import { SelectableList } from '../../Reactflow-Components/ContextMenus/ControlModules/SelectableList';
import { useReactFlow } from '@xyflow/react';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import { AddParameterStudySection } from './AddParameterStudySection';
import _ from 'lodash';
import { InputMenu } from '../../Reactflow-Components/CustomInputWidgets/InputMenu';
import { getInputs, type ComponentInputType } from '../../NodeDataStructures/Nodes/ComponentInputTypes';

interface ParameterStudyMenuProps {
	parameterStudyOptions: InputObject[];
	parameterStudies: ParameterStudy[];
	setParameterStudies: Dispatch<SetStateAction<ParameterStudy[]>>;
}

export function ParameterStudyMenu({
	parameterStudies,
	setParameterStudies,
	parameterStudyOptions,
}: ParameterStudyMenuProps) {
	const [selectedStudy, setSelectedStudy] = useState<ParameterStudy>();
	const allNodes: SusiNode[] = useReactFlow().getNodes() as SusiNode[];
	const selectedNode = allNodes.find((e) => e.id === selectedStudy?.nodeId);
	const selectedNodeName = selectedNode?.data.content ?? '';
	const selectedInputName =
		selectedNode?.data.nodeInputs.find((e) => e.resieName === selectedStudy?.resieName)?.displayName ?? '';

	function getParamStudyTitle(study: ParameterStudy) {
		const node = allNodes.find((n) => study.nodeId === n.id);
		const input = getInputs(study.inputType, node!).find((e) => e.resieName === study.resieName);
		return `${node?.data.content}: ${input?.displayName}(${study.inputType})`;
	}
	function onDelete(study?: ParameterStudy) {
		if (!study) return;
		setParameterStudies((studies) =>
			studies.filter(
				(e) => e.nodeId !== study.nodeId || e.resieName !== study.resieName || e.inputType === study.inputType
			)
		);
	}
	function onAddParameterStudy(nodeId: string, inputType: ComponentInputType, resieName: string) {
		setParameterStudies((paramStudies) => [
			...paramStudies,
			{ nodeId, inputType, resieName, inputs: _.cloneDeep(parameterStudyOptions) },
		]);
	}
	function updateParameterStudyInput(
		nodeId: string,
		inputType: ComponentInputType,
		parameterName: string,
		key: string,
		value: any,
		isIncludedChange: boolean
	) {
		setParameterStudies((studies) => {
			studies = _.cloneDeep(studies);
			const study = studies.find(
				(e) => e.nodeId === nodeId && e.resieName === parameterName && e.inputType === inputType
			);
			const input = study!.inputs.find((e) => e.resieName === key);
			if (isIncludedChange) input!.isIncluded = value;
			else input!.value = value;
			study!.inputs.forEach((e) => {
				e.checkInputValid(study!.inputs);
			});
			return studies;
		});
	}

	return (
		<div className="parameter-study-menu">
			<SelectableList<ParameterStudy | undefined>
				title="Parameter Studies"
				selectedKey={selectedStudy}
				setSelectedKey={setSelectedStudy}
				items={parameterStudies.map((study) => ({ key: study, title: getParamStudyTitle(study) }))}
				onDelete={onDelete}
			/>
			<div style={{ flex: 1 }}>
				<AddParameterStudySection addParameterStudy={onAddParameterStudy} parameterStudies={parameterStudies} />
				<div style={{ height: '1em' }} />
				{selectedStudy && (
					<div className="add-parameter-study-section">
						<div className="modal-subheading">{`${selectedNodeName} ${selectedStudy.inputType} ${selectedInputName} Study Variables`}</div>
						<InputMenu
							title={`${selectedStudy.nodeId} ${selectedStudy.resieName} Study Variables`}
							inputs={selectedStudy!.inputs}
							nodeId={null}
							onValueChange={(key, value) =>
								updateParameterStudyInput(
									selectedStudy.nodeId,
									selectedStudy.inputType,
									selectedStudy.resieName,
									key,
									value,
									false
								)
							}
							onIncludedChange={(key, value) =>
								updateParameterStudyInput(
									selectedStudy.nodeId,
									selectedStudy.inputType,
									selectedStudy.resieName,
									key,
									value,
									true
								)
							}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
