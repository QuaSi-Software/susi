import { DropdownMenu } from 'radix-ui';
import type { ControlModule } from './ControlModulesMenu';
import type { Dispatch, SetStateAction } from 'react';
import type { SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';

interface ControlModulesDropdownProps {
	controlModuleTypes: ControlModule[];
	setEditedNode: Dispatch<SetStateAction<SusiNode>>;
}

export default function ControlModulesDropdown({ controlModuleTypes, setEditedNode }: ControlModulesDropdownProps) {
	function addControleModule(controlModule: ControlModule) {
		const duplicatedControlModule: ControlModule = {
			title: controlModule.title,
			parameters: controlModule.parameters.map((e) => e.copy()),
		};
		setEditedNode((node) => ({
			...node,
			data: { ...node.data, controlModules: [...node.data.controlModules, duplicatedControlModule] },
		}));
	}

	return (
		<DropdownMenu.Root
		//  open={true}
		>
			<DropdownMenu.Trigger asChild>
				<button className="IconButton" aria-label="Choose Sidebar Menu">
					<i className="bi bi-plus-lg"></i>
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content className="DropdownMenuContent" sideOffset={15} align="start" side="right">
					{controlModuleTypes.map((controlModule) => (
						<DropdownMenu.Item
							className="DropdownMenuItem"
							onClick={() => addControleModule(controlModule)}
						>
							{controlModule.title}
						</DropdownMenu.Item>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}
