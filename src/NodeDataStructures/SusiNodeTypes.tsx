/**
 * Contains ReSiE-component-specific data and how they relate to components of streamlit flow.
 */

export const NodeCategory = {
	Special: 'Special',
	General: 'General',
	Heat: 'Heat',
	Electricity: 'Electricity',
	Other: 'Other',
} as const;

export type NodeCategory = (typeof NodeCategory)[keyof typeof NodeCategory];

export interface NodeType {
	type_name: string;
	button_name: string;
	// inputs and outputs are the RESIE input and outputs, not how it should be displayed in the graph
	nr_inputs: number;
	nr_outputs: number;
	segment: string;
	category: NodeCategory;
}

const allNodeTypes: NodeType[] = [
	{
		type_name: 'Bus',
		button_name: 'Bus',
		nr_inputs: 1,
		nr_outputs: 1,
		segment: 'BUS',
		category: NodeCategory.Special,
	},
	{
		type_name: 'GridInput',
		button_name: 'Grid Input',
		nr_inputs: 0,
		nr_outputs: 1,
		segment: 'GRI',
		category: NodeCategory.Special,
	},
	{
		type_name: 'GridOutput',
		button_name: 'Grid Output',
		nr_inputs: 1,
		nr_outputs: 0,
		segment: 'GRO',
		category: NodeCategory.Special,
	},
	{
		type_name: 'FixedSupply',
		button_name: 'Fixed Supply',
		nr_inputs: 0,
		nr_outputs: 1,
		segment: 'SRC',
		category: NodeCategory.General,
	},
	{
		type_name: 'BoundedSupply',
		button_name: 'Bounded Supply',
		nr_inputs: 0,
		nr_outputs: 1,
		segment: 'SRC',
		category: NodeCategory.General,
	},
	{
		type_name: 'Demand',
		button_name: 'Fixed Demand',
		nr_inputs: 1,
		nr_outputs: 0,
		segment: 'DEM',
		category: NodeCategory.General,
	},
	{
		type_name: 'BoundedSink',
		button_name: 'Bounded Sink',
		nr_inputs: 1,
		nr_outputs: 0,
		segment: 'DEM',
		category: NodeCategory.General,
	},
	{
		type_name: 'Storage',
		button_name: 'Storage',
		nr_inputs: 1,
		nr_outputs: 1,
		segment: 'STO',
		category: NodeCategory.General,
	},
	{
		type_name: 'GenericHeatSource',
		button_name: 'Generic Heat Source',
		nr_inputs: 0,
		nr_outputs: 1,
		segment: 'GHS',
		category: NodeCategory.Heat,
	},
	{
		type_name: 'FuelBoiler',
		button_name: 'Fuel Boiler',
		nr_inputs: 1,
		nr_outputs: 1,
		segment: 'FBO',
		category: NodeCategory.Heat,
	},
	{
		type_name: 'HeatPump',
		button_name: 'Heat Pump',
		nr_inputs: 2,
		nr_outputs: 1,
		segment: 'HP',
		category: NodeCategory.Heat,
	},
	{
		type_name: 'GeothermalProbes',
		button_name: 'Geothermal Probes',
		nr_inputs: 1,
		nr_outputs: 1,
		segment: 'GTP',
		category: NodeCategory.Heat,
	},
	{
		type_name: 'GeothermalHeatCollector',
		button_name: 'Geothermal Heat Collector',
		nr_inputs: 1,
		nr_outputs: 1,
		segment: 'GHC',
		category: NodeCategory.Heat,
	},
	{
		type_name: 'Buffertank',
		button_name: 'Buffertank',
		nr_inputs: 1,
		nr_outputs: 1,
		segment: 'BFT',
		category: NodeCategory.Heat,
	},
	{
		type_name: 'SeasonalThermalStorage',
		button_name: 'Seasonal Thermal Storage',
		nr_inputs: 1,
		nr_outputs: 1,
		segment: 'STS',
		category: NodeCategory.Heat,
	},
	{
		type_name: 'SolarthermalCollector',
		button_name: 'Solarthermal Collector',
		nr_inputs: 0,
		nr_outputs: 1,
		segment: 'STC',
		category: NodeCategory.Heat,
	},
	{
		type_name: 'Chpp',
		button_name: 'Combined-Heat-Power Plant',
		nr_inputs: 1,
		nr_outputs: 2,
		segment: 'CHPP',
		category: NodeCategory.Electricity,
	},
	{
		type_name: 'Pvplant',
		button_name: 'Photovoltaic Plant',
		nr_inputs: 0,
		nr_outputs: 1,
		segment: 'PV',
		category: NodeCategory.Electricity,
	},
	{
		type_name: 'Battery',
		button_name: 'Battery',
		nr_inputs: 1,
		nr_outputs: 1,
		segment: 'BAT',
		category: NodeCategory.Electricity,
	},
	{
		type_name: 'Electrolyser',
		button_name: 'Electrolyser',
		nr_inputs: 1,
		nr_outputs: 4,
		segment: 'ELY',
		category: NodeCategory.Other,
	},
];

export function getNodeTypesInCategory(categoryName: NodeCategory): NodeType[] {
	return allNodeTypes.filter((node) => node.category === categoryName);
}

export function getNodeTypeWithName(typeName: string): NodeType | null {
	return allNodeTypes.find((node) => node.type_name.toLowerCase() === typeName.toLowerCase()) || null;
}
