/**
 * Contains ReSiE-component-specific data and how they relate to components of streamlit flow.
 */
import type { InputObject } from '../../Reactflow-Components/CustomInputWidgets/InputObject';

export interface NodeType {
	type_name: string;
	button_name: string;
	// inputs and outputs are the RESIE input and outputs, not how it should be displayed in the graph
	nr_inputs: number;
	nr_outputs: number;
	segment: string;
	category: string;
	inputs: InputObject[];
}
