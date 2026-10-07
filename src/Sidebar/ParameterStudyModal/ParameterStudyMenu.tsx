import { useState, type Dispatch, type SetStateAction } from 'react';
import type { InputObject } from '../../Reactflow-Components/CustomInputWidgets/InputObject';
import type { ParameterStudy } from './ParameterStudyModal';
import { SelectableList } from '../../Reactflow-Components/ContextMenus/ControlModules/SelectableList';
import { useReactFlow } from '@xyflow/react';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';
import { AddParameterStudySection } from './AddParameterStudySection';
import _ from 'lodash';

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

	function getParamStudyTitle(study: ParameterStudy) {
		const node = allNodes.find((n) => study.nodeId === n.id);
		const input = node?.data.nodeInputs.find((e) => e.resieName === study.resieName);
		return `${node?.data.content}: ${input?.displayName}`;
	}
	function onDelete(study?: ParameterStudy) {
		if (!study) return;
		setParameterStudies((studies) =>
			studies.filter((e) => e.nodeId !== study.nodeId || e.resieName !== study.resieName)
		);
	}
	function onAddParameterStudy(nodeId: string, resieName: string) {
		setParameterStudies((paramStudies) => [
			...paramStudies,
			{ nodeId, resieName, inputs: _.cloneDeep(parameterStudyOptions) },
		]);
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
			</div>
		</div>
	);
}
