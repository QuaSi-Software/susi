export interface ImportData {
	components: Record<string, ComponentData>;
	// io_settings: Record<string, any>;
	// simulation_parameters: Record<string, any>;
	mediums?: Array<[string, string | null]>;
	[key: string]: any;
}

export interface Connections {
	input_order: string[];
	output_order: string[];
	energy_flow: number[][];
}

export interface ComponentData {
	type: string;
	import_data?: ComponentImportData;
	connections?: Connections;
	output_refs?: string[] | Record<string, string>;
	[key: string]: any;
}

export interface ComponentImportData {
	node_position: {
		x: number;
		y: number;
	};
	node_type: string;
}
