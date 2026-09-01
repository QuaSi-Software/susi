import { useContext } from 'react';
import { Handle, Position } from '@xyflow/react';
import { getMediumNodeInput, getUndefinedMedium } from '../Mediums/MediumUtils';
import { InputIssueType } from '../../Reactflow-Components/CustomInputWidgets/Validation/InputChecking';
import type { SusiNodeData } from './SusiNodeData';
import { AppContext } from '../../AppContext';

/**
 * create the style object that defines the visuals of this Handle
 * @param {Position} pos
 * @param {int} n the number of handles on this side (source/target) of the node
 * @param {int} i the index of this handle
 * @param {string} handleColor the color the handle should be
 * @returns {Object} a style object for the node's handle
 */
function getHandleStyle(pos: Position, n: number, i: number, handleColor: string, isHidden: boolean) {
	let style: Record<string, string> = {
		background: handleColor,
		borderColor: '#ffffff',
		width: '8px',
		height: '8px',
	};

	if (isHidden) {
		style.visibility = 'hidden';
	}

	if (pos === Position.Left || pos === Position.Right) {
		style.top = `${(i + 1) * (100.0 / (n + 1))}%`;
	} else {
		style.left = `${(i + 1) * (100.0 / (n + 1))}%`;
	}
	return style;
}

interface NodeHandleProps {
	susiData: SusiNodeData;
	position: Position;
	numHandles: number;
	handleIndex: number;
	sourceOrTarget: 'source' | 'target';
}

export function CustomHandle({ sourceOrTarget, susiData, position, numHandles, handleIndex }: NodeHandleProps) {
	const handleName = `${sourceOrTarget}-${handleIndex}`;
	const mediumNodeInput = getMediumNodeInput(handleName, susiData);
	const showHandle = mediumNodeInput.issue.issueType !== InputIssueType.Conditional;

	let isBus = susiData.componentType.toLowerCase() === 'bus';
	let handleType = isBus ? 'bus-handle' : 'custom-handle';
	const mediums = useContext(AppContext)!.mediums;
	const handleMedium = mediums.find((m) => m.key === mediumNodeInput.value) ?? getUndefinedMedium();

	return (
		<Handle
			id={handleName}
			key={susiData.content + handleName}
			className={handleType}
			type={sourceOrTarget}
			position={position}
			isConnectable={showHandle}
			style={getHandleStyle(position, numHandles, handleIndex, handleMedium.color, !showHandle)}
		/>
	);
}
