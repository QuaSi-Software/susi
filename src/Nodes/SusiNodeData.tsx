import type { NodeCategory } from './SusiNodeTypes';

export class SusiNodeData {
	content: string;
	componentType: string;
	resieData: Array<string>;
	handleMediumDict: string;
	busData: string;
	nodeCategory: NodeCategory;

	constructor(
		componentType: string,
		content: string = '',
		resieData: Array<string> = [],
		handleMediumDict: string = '',
		busData: string = '',
		nodeCategory: NodeCategory = 'General'
	) {
		this.content = content;
		this.componentType = componentType;
		this.resieData = resieData;
		this.handleMediumDict = handleMediumDict;
		this.busData = busData;
		this.nodeCategory = nodeCategory;
	}
}
