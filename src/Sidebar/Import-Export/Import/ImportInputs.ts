import type { Medium } from '../../../NodeDataStructures/Mediums/Medium';
import { InputObject, InputObjectType } from '../../../Reactflow-Components/CustomInputWidgets/InputObject';
import type { ResieParameterMenuInfo } from '../../ResieParameters/ResieParameterMenuInfo';
import type { SusiNode } from '../../../NodeDataStructures/Nodes/SusiNode';
import type { ControlModule } from '../../../Reactflow-Components/ContextMenus/ControlModules/ControlModulesMenu';
import _ from 'lodash';

export function setImportedValues(
	inputs: InputObject[],
	importedValues: Record<string, any>,
	mediums: Medium[],
	startEndUnit: string
) {
	for (const nodeInput of inputs) {
		const value = importedValues[nodeInput.resieName];
		if (value !== undefined) {
			nodeInput.setValueOnImport(value, mediums, startEndUnit);
			nodeInput.isIncluded = true;
		} else {
			nodeInput.isIncluded = false;
		}
	}
	InputObject.checkInputsValid(inputs);
}

export function setResieParametersMenusFromImport(
	menus: ResieParameterMenuInfo[],
	menuKey: string,
	importedValues: Record<string, any>,
	startEndUnit: string,
	logError: (message: string) => void
): ResieParameterMenuInfo[] {
	const menu = menus.find((e: ResieParameterMenuInfo) => e.exportKey === menuKey);
	menu!.inputs.forEach((input) => {
		const importedValue = importedValues[input.resieName];
		if (importedValue === undefined) {
			input.isIncluded = false;
		} else {
			input.setValueOnImport(importedValue, [], startEndUnit, logError);
			input.isIncluded = true;
		}
	});
	return menus;
}

export function setControlModules(
	importModules: Record<string, any>[],
	node: SusiNode,
	controlModules: ControlModule[],
	logError: (message: string) => void
) {
	const nodeControlModules: ControlModule[] = [];
	importModules.forEach((dict) => {
		const controlModule = _.cloneDeep(controlModules.find((e) => e.title === dict.name));
		if (!controlModule) {
			logError(`Could not find control module with name ${dict.name}`);
			return;
		}
		controlModule.key = `${controlModule.title}_${nodeControlModules.length}`;
		controlModule.parameters.forEach((input) => {
			if (dict[input.resieName]) {
				input.setValueOnImport(dict[input.resieName], [], '', logError);
				input.isIncluded = true;
			}
		});
		InputObject.checkInputsValid(controlModule.parameters);
		nodeControlModules.push(controlModule);
	});
	node.data.controlModules = nodeControlModules;
}
/**Iterate over all control modules in all nodes and replace the node names in the UAC components with node IDs */
export function replaceComponentUACsWithIDs(nodeArray: SusiNode[], logError: (msg: string) => void) {
	nodeArray.forEach((node) => {
		node.data.controlModules.forEach((controlModule) => {
			controlModule.parameters.forEach((input) => {
				if (input.type === InputObjectType.COMPONENT_UAC) {
					const uacNode = nodeArray.find((n) => n.data.content === input.value);
					if (uacNode === undefined)
						logError(
							`Component UAC ${input.displayName} "${input.value}" in Control modules of component ${node?.data.content} is not in list of components`
						);
					input.value = uacNode?.id;
				} else if (input.type === InputObjectType.COMPONENT_UAC_LIST) {
					const nameList = input.value;
					if (!Array.isArray(nameList)) {
						logError(
							`Component UAC List ${input.displayName} on component ${node?.data.content} is not a list.`
						);
						return;
					}
					const idList = [];
					nameList.forEach((nodeName) => {
						const uacNode = nodeArray.find((n) => n.data.content === input.value);
						if (uacNode === undefined) {
							logError(
								`Component UAC List ${input.displayName} in Control modules of component ${node?.data.content} has unknown UAC in it: "${nodeName}"`
							);
							return;
						}
						idList.push(uacNode!.id);
					});
				}
			});
		});
	});
}
