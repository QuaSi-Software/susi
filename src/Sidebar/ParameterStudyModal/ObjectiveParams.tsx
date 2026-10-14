import type { Dispatch, SetStateAction } from 'react';
import type { ImportData } from '../Import-Export/ExportDataStrucures';

const ObjectiveParamOption = {
	Annuity: 'Total Annuity',
	Emissions: 'Total Emissions',
} as const;
type ObjectiveParamOption = (typeof ObjectiveParamOption)[keyof typeof ObjectiveParamOption];

function exportObjectiveParams(exportObj: ImportData, objectiveParams: ObjectiveParamOption[]) {
	if (objectiveParams.length === 0) return;
	const obj: Record<string, string[]> = {};
	exportObj.parameter_study!.objective_params = obj;
	if (objectiveParams.includes(ObjectiveParamOption.Annuity)) {
		obj['economic'] = ['total_annuity'];
	}
	if (objectiveParams.includes(ObjectiveParamOption.Emissions)) {
		obj['emissions'] = ['total_emissions'];
	}
}

function importObjectiveParams(
	importData: ImportData,
	setObjectiveParams: Dispatch<SetStateAction<ObjectiveParamOption[]>>,
	logError: (message: string) => void
) {
	const objectiveParamImport = importData.parameter_study?.objective_params;
	setObjectiveParams([]);
	if (!objectiveParamImport) return;

	if (checkKeyValue(objectiveParamImport, 'economic', 'total_annuity'))
		setObjectiveParams((arr) => [...arr, ObjectiveParamOption.Annuity]);
	if (checkKeyValue(objectiveParamImport, 'emissions', 'total_emissions'))
		setObjectiveParams((arr) => [...arr, ObjectiveParamOption.Emissions]);

	function checkKeyValue(obj: Record<string, string[]>, key: string, value: string): boolean {
		if (!obj[key]) return false;
		if (!Array.isArray(obj[key])) logError(`objective_params[${key}] must be an array`);
		return obj[key].includes(value);
	}
}

export { ObjectiveParamOption, exportObjectiveParams, importObjectiveParams };
