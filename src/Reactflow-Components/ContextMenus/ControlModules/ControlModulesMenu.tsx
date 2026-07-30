import type { Dispatch, SetStateAction } from 'react';
import type { SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';
import type { InputObject } from '../../CustomInputWidgets/InputObject';
import { Modal } from 'react-bootstrap';
import ControlModulesDropdown from './ControlModulesDropdown';

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
		<Modal.Body>
			<Modal.Header>Control Modules</Modal.Header>
			<ControlModulesDropdown controlModuleTypes={controlModuleTypes} setEditedNode={setEditedNode} />
		</Modal.Body>
	);
}
