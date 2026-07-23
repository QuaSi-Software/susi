export interface ImportData {
	components: Record<string, ComponentData>;
	mediums?: Array<[string, string | null]>;
	groups?: NodeGroup[]; /** For importing back into susi only */
	/** General Parameters */
	io_settings?: Record<string, any>;
	emissions?: Record<string, any>;
	simulation_parameters?: Record<string, any>;
	economic?: Record<string, any>;
	[key: string]: any;
}

export interface NodeGroup {
	groupName: string;
	nodesInGroup: string[];
	groupColorIndex: number;
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
