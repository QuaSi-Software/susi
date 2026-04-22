import type { ComponentData, ComponentImportData } from './ExportDataStrucures';

export const getComponentImportData = (nodeData: ComponentData): ComponentImportData => {
	let importData: ComponentImportData | undefined = nodeData.import_data;
	if (!importData) importData = generateImportData(nodeData);
	if (!importData.node_position || !importData.node_position.x || !importData.node_position.y) {
		importData.node_position = { x: 0, y: 0 };
	}
	if (!importData.node_type) {
		importData.node_type = generateImportData(nodeData).node_type;
	}
	return importData;
};

const generateImportData = (nodeData: ComponentData): ComponentImportData => {
	let typeName = nodeData.type;
	if (typeName === 'GridConnection') {
		if (nodeData.is_source) {
			typeName = 'gridinput';
		} else {
			typeName = 'gridoutput';
		}
	}
	return {
		node_position: { x: 0, y: 0 },
		node_type: typeName,
	};
};
