import { type Dispatch, type SetStateAction } from 'react';
import type { SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';
import type { InputObject } from '../../CustomInputWidgets/InputObject';
import ControlModulesDropdown from './ControlModulesDropdown';
import { Accordion } from 'radix-ui';
import { ControleModulesList } from './ControlModulesList';

export interface ControlModule {
	title: string;
	parameters: InputObject[];
}

interface ControleModulesMenuProps {
	controlModuleTypes: ControlModule[];
	node: SusiNode;
	setEditedNode: Dispatch<SetStateAction<SusiNode>>;
}

export function ControleModulesMenu({ controlModuleTypes, node, setEditedNode }: ControleModulesMenuProps) {
	/** Title, button to add more control modules, and a list of control modlues currently on the node with a way to delete them */
	return (
		<>
			<Accordion.Item className="AccordionItem" value="Control Modules">
				<Accordion.Header className="AccordionHeader">
					<Accordion.Trigger className="modal-header accordion-header-button">
						Control Modules
						<i className="bi bi-chevron-down"></i>
					</Accordion.Trigger>
				</Accordion.Header>

				<Accordion.Content>
					<ControlModulesDropdown controlModuleTypes={controlModuleTypes} setEditedNode={setEditedNode} />
					<ControleModulesList controleModules={node.data.controlModules} setEditedNode={setEditedNode} />
				</Accordion.Content>
			</Accordion.Item>
		</>
	);
}
