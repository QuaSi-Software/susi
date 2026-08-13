import { DropdownMenu } from 'radix-ui';
import type { ControlModule } from './ControlModulesMenu';
import { getTitleFromKey } from '../ContextMenuUtils';

interface ControlModulesDropdownProps {
	controlModuleTypes: ControlModule[];
	addControlModule: (controlModule: ControlModule) => void;
}

export default function ControlModulesDropdown({ controlModuleTypes, addControlModule }: ControlModulesDropdownProps) {
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
						onClick={() => addControlModule(controlModule)}
					>
						{getTitleFromKey(controlModule.title)}
					</DropdownMenu.Item>
				))}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
