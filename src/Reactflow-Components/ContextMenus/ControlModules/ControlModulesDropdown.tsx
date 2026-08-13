import { DropdownMenu } from 'radix-ui';
import type { ControlModule } from './ControlModulesMenu';
import type { Dispatch, SetStateAction } from 'react';
import type { SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';
import { getTitleFromKey } from '../ContextMenuUtils';

interface ControlModulesDropdownProps {
	controlModuleTypes: ControlModule[];
	setEditedNode: Dispatch<SetStateAction<SusiNode>>;
}

export default function ControlModulesDropdown({ controlModuleTypes, setEditedNode }: ControlModulesDropdownProps) {
	function addControleModule(controlModule: ControlModule) {
		const duplicatedControlModule: ControlModule = {
			title: controlModule.title,
			parameters: controlModule.parameters.map((e) => e.copy()),
			key: `${controlModule.title}_${new Date().getTime()}`,
		};
		duplicatedControlModule.parameters.forEach((param) => {
			param.checkInputValid(duplicatedControlModule.parameters);
		});
		const newModuleValid = duplicatedControlModule.parameters.every((e) => e.isValid());
		setEditedNode((node) => ({
			...node,
			data: {
				...node.data,
				hasValidInputs: node.data.hasValidInputs && newModuleValid,
				controlModules: [...node.data.controlModules, duplicatedControlModule],
			},
		}));
	}

	return (
		<DropdownMenu.Root
		// open={true}
		>
			<DropdownMenu.Trigger asChild className="add-module-button">
				<button className="IconButton" aria-label="Choose Sidebar Menu">
					<i
						className="bi bi-plus-lg"
						style={{
							fontSize: 'x-large',
						}}
					></i>
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="DropdownMenuContent" sideOffset={15} align="start" side="right">
				{controlModuleTypes.map((controlModule, index) => (
					<DropdownMenu.Item
						key={`control-module-${index}`}
						className="DropdownMenuItem"
						onClick={() => addControleModule(controlModule)}
					>
						{getTitleFromKey(controlModule.title)}
					</DropdownMenu.Item>
				))}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
