import BusData from '../Bus/BusData';
import { InputObjectType, type InputObject } from '../../Reactflow-Components/CustomInputWidgets/InputObject';
import type { NodeType } from './SusiNodeTypes';
import type { ApiCategory } from '../../FetchingApiData/ApiData';
import { mutexSolver } from '../../Reactflow-Components/CustomInputWidgets/Validation/Mutex';
import type { ControlModule } from '../../Reactflow-Components/ContextMenus/ControlModules/ControlModulesMenu';
import type { ResieParameterMenuInfo } from '../../Sidebar/ResieParameters/ResieParameterMenuInfo';

interface MediumHandleDict {
	source: string[];
	target: string[];
}

export interface SusiNodeData extends Record<string, unknown> {
	content: string;
	componentType: string;
	nodeInputs: InputObject[];
	controlModules: ControlModule[];
	controlParameters?: ResieParameterMenuInfo;
	emissionsInputs: InputObject[];
	economicInputs: InputObject[];
	inputCategories: ApiCategory[];
	handleMediumDict: MediumHandleDict;
	busData: BusData | null;
	nodeCategory: string;
	sourceHandles: number;
	targetHandles: number;
	hasValidInputs: boolean;
	hasValidName: boolean;
	colorIndex?: number;
}

function getMediumHandleDict(
	nodeInputs: InputObject[],
	sourceHandles: number,
	targetHandles: number
): MediumHandleDict {
	const mediumVariables = nodeInputs.filter((x) => x.type === InputObjectType.MEDIUM);

	if (mediumVariables.length === 1) {
		// all handles are mapped to that variable name
		const mediumVariableName = mediumVariables[0].resieName;
		const srcList = Array(sourceHandles).fill(mediumVariableName);
		const trgtList = Array(targetHandles).fill(mediumVariableName);
		return {
			source: srcList,
			target: trgtList,
		};
	} else {
		// each medium defines one handle
		const srcList: string[] = [];
		const trgtList: string[] = [];

		for (const medium of mediumVariables) {
			const mediumVariableName = medium.resieName;
			// Check if the variable name indicates it's a source or target
			if (mediumVariableName.toLowerCase().includes('out')) {
				srcList.push(mediumVariableName);
			} else {
				trgtList.push(mediumVariableName);
			}
		}

		trgtList.sort();
		srcList.sort();

		return {
			source: srcList,
			target: trgtList,
		};
	}
}

export function createSusiNodeData(
	nodeType: NodeType,
	controlParameters: ResieParameterMenuInfo,
	content: string = ''
): SusiNodeData {
	const nodeInputs = nodeType.inputs.map((e) => e.copy());
	nodeInputs.forEach((input) => {
		input.checkInputValid(nodeInputs);
	});
	mutexSolver(nodeInputs);
	// const hasValidInputs = nodeInputs.every((input) => input.isValid());
	const componentType = nodeType.type_name;
	const busData = componentType.toLowerCase() === 'bus' ? new BusData() : null;
	const handleMediumDict = getMediumHandleDict(nodeInputs, nodeType.nr_outputs, nodeType.nr_inputs);
	const copiedControlParameters = Object.assign({}, controlParameters);
	copiedControlParameters.inputs = controlParameters.inputs.map((e) => e.copy());
	return {
		content,
		componentType: componentType,
		nodeInputs: nodeInputs,
		controlModules: [],
		controlParameters: copiedControlParameters,
		handleMediumDict: handleMediumDict,
		busData: busData,
		nodeCategory: nodeType.category,
		sourceHandles: nodeType.nr_outputs,
		targetHandles: nodeType.nr_inputs,
		hasValidInputs: true,
		hasValidName: true,
		inputCategories: nodeType.inputCategories,
		economicInputs: nodeType.economic.map((e) => e.copy()),
		emissionsInputs: nodeType.emissions.map((e) => e.copy()),
	};
}
