import type { NodeType, NodeCategory } from './SusiNodeTypes';

export class SusiNodeData {
	content: string;
	componentType: NodeType;
	resieData: Array<string>;
	handleMediumDict: string;
	busData: string;
	nodeCategory: NodeCategory;

	constructor(
		componentType: NodeType,
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
