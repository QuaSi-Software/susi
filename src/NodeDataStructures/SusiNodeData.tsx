import type BusData from './BusData';
import type { NodeInput } from './NodeInput';
import type { NodeCategory } from './SusiNodeTypes';

export interface SusiNodeData extends Record<string, unknown> {
	content: string;
	componentType: string;
	resieData: Array<NodeInput>;
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
	busData: BusData | null = null,
	nodeCategory: NodeCategory = 'General',
	sourceHandles: number = 0,
	targetHandles: number = 0
): SusiNodeData {
	return {
		content,
		componentType,
		resieData,
		handleMediumDict,
		busData,
		nodeCategory,
		sourceHandles,
		targetHandles,
	};
}
