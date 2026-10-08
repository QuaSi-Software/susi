import { useState, type Dispatch, type SetStateAction } from 'react';
import type { InputObject } from '../../Reactflow-Components/CustomInputWidgets/InputObject';
import type { ParameterStudy } from './ParameterStudyModal';
import { SelectableList } from '../../Reactflow-Components/ContextMenus/ControlModules/SelectableList';
import { useReactFlow } from '@xyflow/react';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import { AddParameterStudySection } from './AddParameterStudySection';
import _ from 'lodash';
import { InputMenu } from '../../Reactflow-Components/CustomInputWidgets/InputMenu';
import { changeInputListElement } from '../ResieParameters/ResieParameterMenuInfo';

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
	const selectedNode = allNodes.find((e) => e.id === selectedStudy?.title);
	const selectedNodeName = selectedNode?.data.content ?? '';
	const selectedInputName =
		selectedNode?.data.nodeInputs.find((e) => e.resieName === selectedStudy?.resieName)?.displayName ?? '';

	function getParamStudyTitle(study: ParameterStudy) {
		const node = allNodes.find((n) => study.title === n.id);
		const input = node?.data.nodeInputs.find((e) => e.resieName === study.resieName);
		return `${node?.data.content}: ${input?.displayName}`;
	}
	function onDelete(study?: ParameterStudy) {
		if (!study) return;
		setParameterStudies((studies) =>
			studies.filter((e) => e.title !== study.title || e.resieName !== study.resieName)
		);
	}
	function onAddParameterStudy(nodeId: string, resieName: string) {
		setParameterStudies((paramStudies) => [
			...paramStudies,
			{ title: nodeId, resieName, inputs: _.cloneDeep(parameterStudyOptions) },
		]);
	}
	function updateParameterStudyInput(nodeId: string, resieName: string, value: any, isIncludedChange: boolean) {
		changeInputListElement<ParameterStudy>(setParameterStudies, nodeId, resieName, value, isIncludedChange);
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
						<div className="modal-subheading">{`${selectedNodeName} ${selectedInputName} Study Variables`}</div>
						<InputMenu
							title={`${selectedStudy.title} ${selectedStudy.resieName} Study Variables`}
							inputs={selectedStudy!.inputs}
							nodeId={null}
							onValueChange={(key, value) =>
								updateParameterStudyInput(selectedStudy.title, key, value, false)
							}
							onIncludedChange={(key, value) =>
								updateParameterStudyInput(selectedStudy.title, key, value, true)
							}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
