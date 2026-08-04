import type { Dispatch, SetStateAction } from 'react';
import type { Medium } from '../../../NodeDataStructures/Mediums/Medium';
import type { InputObject } from '../../../Reactflow-Components/CustomInputWidgets/InputObject';
import type { ResieParameterMenuInfo } from '../../ResieParameters/ResieParameterMenuInfo';

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

export function setListOfInputs(
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
