import type { Node, XYPosition } from '@xyflow/react';
import type { NodeType } from './SusiNodeTypes';
import { Position } from '@xyflow/react';
import { type SusiNodeData, createSusiNodeData } from './SusiNodeData';

import _ from 'lodash';
import { findNameForDuplicate } from '../../Reactflow-Components/ContextMenus/ContextMenuUtils';
import type { ResieParameterMenuInfo } from '../../Sidebar/ResieParameters/ResieParameterMenuInfo';

/**
 * SusiNode is a normal ReactFlow Node, but with data replaced by the interface SusiNodeData for clarity
 * We want our data structures to be clear, so you can easily tell what data is where without a debugger
 */
export type SusiNode = Node & { data: SusiNodeData };

const createNodeFromType = (
	nodes: SusiNode[],
	nodeType: NodeType,
	position: XYPosition,
	nodeNamePrefix: string,
	controlParameters: ResieParameterMenuInfo,
	content: string | null = null
): SusiNode => {
	const timestamp = Date.now();
	if (!content) {
		if (nodeNamePrefix !== '') nodeNamePrefix += '_';
		const baseName = nodeNamePrefix + nodeType.segment + '_';
		content = findNameForDuplicate(baseName, nodes);
	}
	const susiNodeData = createSusiNodeData(nodeType, controlParameters, content);
	const node: SusiNode = {
		id: `${content}_${timestamp}`,
		position: position,
		data: susiNodeData,
		type: 'default',
		sourcePosition: Position.Bottom,
		targetPosition: Position.Top,
		hidden: false,
		selected: false,
		dragging: false,
		draggable: true,
		selectable: true,
		connectable: true,
		resizing: false,
		deletable: true,
		zIndex: 0,
		focusable: true,
		style: {
			'--category': susiNodeData.nodeCategory.toLowerCase(),
			width: 'auto',
		} as React.CSSProperties,
	};
	checkNodeValidInputs(node, null);
	return node;
};

export function showEconomicParameters(getResieParameter: (menuName: string, parameterName: string) => boolean) {
	return getResieParameter('economic', 'calculate_economy');
}
export function showEmissionsParameters(getResieParameter: (menuName: string, parameterName: string) => boolean) {
	return getResieParameter('emissions', 'calculate_emissions');
}

/** Check all if all inputs in node are valid and assign node.data.hasValidInputs  */
export function checkNodeValidInputs(
	node: SusiNode,
	getResieParameter: ((menuName: string, parameterName: string) => boolean) | null
) {
	console.assert(
		node.data.nodeInputs !== undefined,
		`Trying to access node inputs of group node: ${node.data.label}`
	);
	const hasValidInputs = node.data.nodeInputs!.every((input) => input.isValid());
	const hasValidControlModules = node.data.controlModules.every((m) => {
		return m.parameters.every((input) => input.isValid());
	});
	const hasValidControlParameters = node.data.controlParameters?.inputs.every((input) => input.isValid()) ?? true;

	/** check economic and emisions parameters */
	let hasValidEconomicParameters = true;
	let hasValidEmissionsParameters = true;
	if (getResieParameter) {
		hasValidEconomicParameters =
			!showEconomicParameters(getResieParameter) || node.data.economicInputs.every((input) => input.isValid());
		hasValidEmissionsParameters =
			!showEmissionsParameters(getResieParameter) || node.data.emissionsInputs.every((input) => input.isValid());
	}

	node.data.hasValidInputs =
		hasValidInputs &&
		hasValidControlModules &&
		hasValidControlParameters &&
		hasValidEconomicParameters &&
		hasValidEmissionsParameters;
}

export const deepCloneNode = (node: SusiNode): SusiNode => {
	const newNode = _.cloneDeep(node);
	newNode.data.nodeInputs = node.data.nodeInputs.map((input) => input.copy());
	return newNode;
};
export const deepCloneNodes = (nodes: SusiNode[]): SusiNode[] => {
	return nodes.map((n) => deepCloneNode(n));
};

export default createNodeFromType;
