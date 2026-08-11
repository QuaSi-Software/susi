import { useState, type Dispatch, type SetStateAction } from 'react';
import type { SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';
import type { InputObject } from '../../CustomInputWidgets/InputObject';
import ControlModulesDropdown from './ControlModulesDropdown';
import { Accordion } from 'radix-ui';
import { Button } from 'react-bootstrap';
import { AccordionInputMenu } from '../../CustomInputWidgets/AccordionInputMenu';
import { InputMenu } from '../../CustomInputWidgets/InputMenu';

export interface ControlModule {
	title: string;
	parameters: InputObject[];
	key?: string;
}

interface ControleModulesMenuProps {
	controlModuleTypes: ControlModule[];
	node: SusiNode;
	setEditedNode: Dispatch<SetStateAction<SusiNode>>;
}

export function ControleModulesMenu({ controlModuleTypes, node, setEditedNode }: ControleModulesMenuProps) {
	const [selectedModuleKey, setSelectedModuleKey] = useState<string>('');
	const controlModules = node.data.controlModules;
	const selectedModuleColor = '#afbdde';
	const selectedModule = controlModules.find((e) => e.key === selectedModuleKey);
	console.debug(`Selected Module key is ${selectedModuleKey}, so the selected module is ${selectedModule}`);

	function setControleModuleParameter(paramName: string, value: any) {
		if (!selectedModule) return;
		setEditedNode((node) => {
			const input = selectedModule.parameters.find((e) => e.resieName === paramName);
			console.assert(
				input !== undefined,
				`Cannot find Module parameter ${paramName} on module ${selectedModule.title}`
			);
			input!.value = value;
			return { ...node, data: { ...node.data, controlModules: controlModules } };
		});
	}
	function deleteControlModule(controleModule: ControlModule) {
		setEditedNode((node) => {
			const filteredControlModules = node.data.controlModules.filter((e) => e.key !== controleModule.key);
			return { ...node, data: { ...node.data, controlModules: filteredControlModules } };
		});
	}
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

				<Accordion.Content style={{ display: 'flex' }}>
					<div className="controle-module-list">
						<div className="modal-subheading">Modules on this Component</div>
						{controlModules.map((controleModule, index) => (
							<div
								key={`controle-module-${index}`}
								className="controle-module-item"
								style={
									controleModule.key === selectedModuleKey
										? { backgroundColor: selectedModuleColor }
										: {}
								}
							>
								<div
									onClick={() => setSelectedModuleKey(controleModule.key!)}
									style={{ flexGrow: 1, paddingRight: '2em' }}
								>
									{controleModule.title}
								</div>
								<Button variant="danger" size="sm" onClick={() => deleteControlModule(controleModule)}>
									Delete
								</Button>
							</div>
						))}
						<ControlModulesDropdown controlModuleTypes={controlModuleTypes} setEditedNode={setEditedNode} />
					</div>
					{selectedModule && (
						<div style={{ flex: '1 1 0', margin: '0.5em' }}>
							<div className="modal-subheading">{selectedModule.title}</div>
							<InputMenu
								title={selectedModule.title}
								inputs={selectedModule.parameters}
								onIncludedChange={(resieName: string, isIncluded: boolean) => {}}
								onValueChange={(resieName: string, newValue: string | number | boolean) => {}}
							/>
						</div>
					)}
				</Accordion.Content>
			</Accordion.Item>
		</>
	);
}
