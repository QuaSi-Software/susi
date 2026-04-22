import { createMedium, type Medium } from '../../../NodeDataStructures/Medium';
import { NodeInputType } from '../../../NodeDataStructures/NodeInput';
import getNodeInputs from '../../../NodeDataStructures/NodeInputData';
import { getDefaultMediums, getRandomColor } from '../../Mediums/MediumUtils';
import type { ComponentData, ImportData } from '../ExportDataStrucures';
import { getComponentImportData } from './ImportData';

export default function getImportMediums(importDict: ImportData) {
	let mediums: Medium[] = [];
	const importedMediums = importDict.mediums || generateMediumListFromComponents(importDict.components);

	for (const [name, color] of importedMediums) {
		mediums.push(createMediumFromImport(name, color));
	}
	return mediums;
}

const createMediumFromImport = (name: string, color: string | null) => {
	const defaultMediums = getDefaultMediums();
	const defaultMediumWithName = defaultMediums.find((m) => m.name == name);
	if (defaultMediumWithName) {
		return defaultMediumWithName;
	}
	const mediumColor = color || getRandomColor();
	const key = `m_${name}_${Date.now()}`;
	return createMedium(name, mediumColor, key);
};

function generateMediumListFromComponents(components: Record<string, ComponentData>): Array<[string, string | null]> {
	const mediums: string[] = [];

	for (const [_, nodeData] of Object.entries(components)) {
		nodeData.import_data = getComponentImportData(nodeData);
		const typeName = nodeData.import_data.node_type;
		const nodeInputs = getNodeInputs(typeName, []);

		const mediumInputs = nodeInputs.filter((input) => input.type === NodeInputType.MEDIUM);

		for (const mediumInput of mediumInputs) {
			const mediumName = nodeData[mediumInput.resieName];
			if (mediumName && !mediums.includes(mediumName)) {
				mediums.push(mediumName);
			}
		}
	}

	return mediums.map((m) => [m, null]);
}
