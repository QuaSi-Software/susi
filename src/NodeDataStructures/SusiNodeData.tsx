import BusData from './BusData';
import type { NodeInput } from './NodeInput';
import type { NodeCategory } from './SusiNodeTypes';

export interface SusiNodeData extends Record<string, unknown> {
	content: string;
	componentType: string;
	nodeInputs: Array<NodeInput>;
	handleMediumDict: string;
	busData: BusData | null;
	nodeCategory: NodeCategory;
	sourceHandles: number;
	targetHandles: number;
}

export function createSusiNodeData(
	componentType: string,
	content: string = '',
	resieData: Array<NodeInput> = [],
	handleMediumDict: string = '',
	nodeCategory: NodeCategory = 'General',
	sourceHandles: number = 0,
	targetHandles: number = 0
): SusiNodeData {
	const busData = componentType.toLowerCase() === 'bus' ? new BusData() : null;
	return {
		content,
		componentType,
		nodeInputs: resieData,
		handleMediumDict,
		busData,
		nodeCategory,
		sourceHandles,
		targetHandles,
	};
}
