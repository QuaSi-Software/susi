import { useState, type Dispatch, type SetStateAction } from 'react';
import { type ControlModule } from './ControlModulesMenu';
import type { SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';

interface ControleModulesListProps {
	controleModules: ControlModule[];
	setEditedNode: Dispatch<SetStateAction<SusiNode>>;
}

export function ControleModulesList({ controleModules, setEditedNode }: ControleModulesListProps) {
	const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);

	function setControleModuleParameter(paramName: string, value: any) {
		setEditedNode((node) => {
			const input = controleModules[selectedModuleIndex].parameters.find((e) => e.resieName === paramName);
			console.assert(
				input !== undefined,
				`Cannot find Module parameter ${paramName} on module ${controleModules[selectedModuleIndex]}`
			);
			input!.value = value;
			return { ...node, data: { ...node.data, controlModules: controleModules } };
		});
	}
	return (
		<ul>
			{controleModules.map((controleModule, index) => (
				<li key={`controle-module-${index}`}>{controleModule.title}</li>
			))}
		</ul>
	);
}
