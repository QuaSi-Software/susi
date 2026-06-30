import { createMedium, type Medium } from '../../../NodeDataStructures/Mediums/Medium';
import { InputObjectType } from '../../../Reactflow-Components/CustomInputWidgets/InputObject';
import { getDefaultMediums, getRandomColor } from '../../../NodeDataStructures/Mediums/MediumUtils';
import type { ComponentData, ImportData } from '../ExportDataStrucures';
import { getComponentImportData } from './ImportData';
import type { NodeType } from '../../../NodeDataStructures/Nodes/SusiNodeTypes';

export default function getImportMediums(importDict: ImportData, nodeTypes: Record<string, NodeType>) {
	let mediums: Medium[] = getDefaultMediums();
	const importedMediums = importDict.mediums || generateMediumListFromComponents(importDict.components, nodeTypes);

	for (const [name, color] of importedMediums) {
		if (mediums.find((m) => m.name === name)) continue;
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

function generateMediumListFromComponents(
	components: Record<string, ComponentData>,
	nodeTypes: Record<string, NodeType>
): Array<[string, string | null]> {
	const mediums: string[] = [];

	for (const [_, nodeData] of Object.entries(components)) {
		nodeData.import_data = getComponentImportData(nodeData);
		const typeName = nodeData.import_data.node_type;
		if (!Object.keys(nodeTypes).includes(typeName)) {
			console.warn(`${typeName} is not a valid Component Type.`);
			continue;
		}
		const nodeInputs = nodeTypes[typeName].inputs;

		if (nodeInputs === null) return []; /** TODO */
		const mediumInputs = nodeInputs.filter((input) => input.type === InputObjectType.MEDIUM);

		for (const mediumInput of mediumInputs) {
			const mediumName = nodeData[mediumInput.resieName];
			if (mediumName && !mediums.includes(mediumName)) {
				mediums.push(mediumName);
			}
		}
	}

	return mediums.map((m) => [m, null]);
}
