import { useState, type Dispatch, type SetStateAction } from 'react';
import { checkNodeValidInputs, type SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';
import type { InputObject } from '../../CustomInputWidgets/InputObject';
import ControlModulesDropdown from './ControlModulesDropdown';
import { Accordion } from 'radix-ui';
import { Button } from 'react-bootstrap';
import { InputMenu } from '../../CustomInputWidgets/InputMenu';
import _ from 'lodash';
import type { ResieParameterMenuInfo } from '../../../Sidebar/ResieParameters/ResieParameterMenuInfo';
import { getTitleFromKey } from '../ContextMenuUtils';

export interface ControlModule {
	title: string;
	parameters: InputObject[];
	key?: string;
}

interface ControleModulesMenuProps {
	controlModuleTypes: ControlModule[];
	node: SusiNode;
	setEditedNode: Dispatch<SetStateAction<SusiNode>>;
	resieParameterMenus: ResieParameterMenuInfo[];
}

export function ControleModulesMenu({
	controlModuleTypes,
	node,
	setEditedNode,
	resieParameterMenus,
}: ControleModulesMenuProps) {
	const [selectedModuleKey, setSelectedModuleKey] = useState<string>('');
	const controlModules = _.cloneDeep(node.data.controlModules);
	const selectedModuleColor = '#c5d0eb';
	const selectedModule = controlModules.find((e) => e.key === selectedModuleKey);

	function setControlModuleParameter(paramName: string, value: any, isIncludeChange: boolean) {
		if (!selectedModule) return;
		setEditedNode((node) => {
			const input = selectedModule.parameters.find((e) => e.resieName === paramName);
			console.assert(
				input !== undefined,
				`Cannot find Module parameter ${paramName} on module ${selectedModule.title}`
			);
			if (isIncludeChange) input!.isIncluded = value;
			else input!.value = value;
			selectedModule.parameters.forEach((e) => {
				e.checkInputValid(selectedModule.parameters);
			});
			const newNode = { ...node, data: { ...node.data, controlModules: controlModules } };
			checkNodeValidInputs(newNode, resieParameterMenus);
			return newNode;
		});
	}
	function deleteControlModule(controleModule: ControlModule) {
		setEditedNode((node) => {
			const filteredControlModules = node.data.controlModules.filter((e) => e.key !== controleModule.key);
			const newNode = { ...node, data: { ...node.data, controlModules: filteredControlModules } };
			checkNodeValidInputs(newNode, resieParameterMenus);
			return newNode;
		});
	}
	function addControlModule(controlModule: ControlModule) {
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
		setSelectedModuleKey(duplicatedControlModule.key!);
	}

	function hasIssues() {
		return !node.data.controlModules.every((cm) => cm.parameters.every((input) => input.isValid()));
	}

	/** Title, button to add more control modules, and a list of control modules currently on the node with a way to delete them */
	return (
		<>
			<Accordion.Item className="AccordionItem" value="Control Modules">
				<Accordion.Header className="AccordionHeader">
					<Accordion.Trigger className="modal-header accordion-header-button">
						Control Modules
						{hasIssues() && '⚠️'}
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
									{getTitleFromKey(controleModule.title)}
								</div>
								<Button variant="danger" size="sm" onClick={() => deleteControlModule(controleModule)}>
									Delete
								</Button>
							</div>
						))}
						<ControlModulesDropdown
							controlModuleTypes={controlModuleTypes}
							addControlModule={addControlModule}
						/>
					</div>
					{selectedModule && (
						<div style={{ flex: '1 1 0', margin: '0.5em' }} key={`${selectedModule.key ?? 'no-key'}`}>
							<div className="modal-subheading">{getTitleFromKey(selectedModule.title)}</div>
							<InputMenu
								title={selectedModule.title}
								inputs={selectedModule.parameters}
								nodeId={node.id}
								onIncludedChange={(resieName: string, isIncluded: boolean) =>
									setControlModuleParameter(resieName, isIncluded, true)
								}
								onValueChange={(resieName: string, newValue: string | number | boolean) =>
									setControlModuleParameter(resieName, newValue, false)
								}
							/>
						</div>
					)}
				</Accordion.Content>
			</Accordion.Item>
		</>
	);
}
