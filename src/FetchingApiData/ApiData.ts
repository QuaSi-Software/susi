interface ApiReturn {
	components: {
		control: Record<string, APIParameter>;
		control_categories: ApiCategory[];
		control_modules: Record<string, Object>;
		type_categories: ApiCategory[];
		types: Record<string, ApiComponent>;
	};
	general: {
		economic: Record<string, APIParameter>;
		economic_categories: ApiCategory[];
		emissions: Record<string, APIParameter>;
		emissions_categories: ApiCategory[];
		io_categories: ApiCategory[];
		io_settings: Record<string, APIParameter>;
		simulation: Record<string, APIParameter>;
		simulation_categories: ApiCategory[];
	};
}

interface ApiCategory {
	heading: string;
	index: number;
	parameters?: string[];
	types?: string[];
}

interface ApiComponent {
	display_name: string;
	economic: Record<string, Object>;
	emissions: Record<string, Object>;
	nr_inputs: number;
	nr_outputs: number;
	param_categories: ApiCategory[];
	parameters: APIParameter[];
	segment: string;
}

interface APIParameter {
	conditionals: string[][];
	default: any;
	description: string;
	display_name: string;
	json_type: string;
	options: string[];
	required: false;
	type: string;
	unit: string;
	validations: Array<Array<string | number>>;
}

export type { ApiReturn, ApiCategory, ApiComponent, APIParameter };
