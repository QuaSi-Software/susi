import type { Dispatch, SetStateAction } from 'react';
import type { Medium } from '../../../NodeDataStructures/Mediums/Medium';
import type { InputObject } from '../../../Reactflow-Components/CustomInputWidgets/InputObject';
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
	for (const nodeInput of inputs) {
		nodeInput.checkInputValid(inputs);
	}
}

export function setResieParametersMenus(
	setter: Dispatch<SetStateAction<ResieParameterMenuInfo[]>>,
	menuKey: string,
	importedValues: Record<string, any>,
	startEndUnit: string
) {
	setter((ResieParameterMenuInfo) => {
		const menu = ResieParameterMenuInfo.find((e) => e.exportKey === menuKey);
		menu!.inputs.forEach((input) => {
			const importedValue = importedValues[input.resieName];
			if (importedValue === undefined) {
				input.isIncluded = false;
			} else {
				input.setValueOnImport(importedValue, [], startEndUnit);
			}
		});
		return ResieParameterMenuInfo;
	});
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
				input.setValueOnImport(dict[input.resieName], [], '');
				input.isIncluded = true;
			}
		});
		controlModule.parameters.forEach((input) => {
			input.checkInputValid(controlModule.parameters);
		});
		nodeControlModules.push(controlModule);
	});
	node.data.controlModules = nodeControlModules;
}
