import { memo, useContext } from 'react';
import { Handle, Position } from '@xyflow/react';
import Markdown from 'react-markdown';
import type { SusiNodeData } from './SusiNodeData';
import { AppContext } from '../../AppContext';
import { getMedium } from '../Mediums/MediumUtils';

const MemoizedMarkdown = memo(({ content }: { content: string }) => <Markdown>{content}</Markdown>);

/**
 * create the style object that defines the visuals of this Handle
 * @param {Position} pos
 * @param {int} n the number of handles on this side (source/target) of the node
 * @param {int} i the index of this handle
 * @param {string} handleColor the color the handle should be
 * @returns {Object} a style object for the node's handle
 */
function getHandleStyle(pos: Position, n: number, i: number, handleColor: string) {
	let style: Record<string, string> = {
		background: handleColor,
		borderColor: '#ffffff',
		width: '8px',
		height: '8px',
	};

	if (pos === Position.Left || pos === Position.Right) {
		style.top = `${(i + 1) * (100.0 / (n + 1))}%`;
	} else {
		style.left = `${(i + 1) * (100.0 / (n + 1))}%`;
	}
	return style;
}

function MarkdownNode(susiData: SusiNodeData, sourcePosition: boolean, targetPosition: boolean) {
	const sourceHandles = susiData.sourceHandles !== undefined ? susiData.sourceHandles : 0;
	const targetHandles = susiData.targetHandles !== undefined ? susiData.targetHandles : 0;
	const sourcePos = sourcePosition && Position.Right;
	const targetPos = targetPosition && Position.Left;
	const mediums = useContext(AppContext)!.mediums;

	/**
	 * Get the color of the medium associated with this handle
	 * @param {string} handleName the handle's name like target-0 or source-2
	 * @returns {string} the color the handle should be (in format: "#ff00cc")
	 */
	function getHandleColor(handleName: string): string {
		const medium = getMedium(handleName, susiData, mediums);
		if (!medium) {
			console.debug(`Handle ${handleName} on Node ${susiData.content} has no medium defined.`);
			return '#ffffff';
		}
		return medium.color;
	}

	let isBus = susiData.componentType.toLowerCase() === 'bus';
	let handleType = isBus ? 'bus-handle' : 'custom-handle';
	return (
		<>
			<div className="node-handles">
				{sourcePos &&
					[...Array(sourceHandles)].map((_, i) => (
						<Handle
							id={`source-${i}`}
							key={susiData.content + '_source-' + i}
							className={handleType}
							type="source"
							position={sourcePos}
							isConnectable
							style={getHandleStyle(sourcePos, sourceHandles, i, getHandleColor('source-' + i))}
						/>
					))}
			</div>

			<div className="markdown-node">
				<MemoizedMarkdown content={susiData.content} />
			</div>

			<div className="node-handles">
				{targetPos &&
					[...Array(targetHandles)].map((_, i) => (
						<Handle
							id={`target-${i}`}
							key={susiData.content + '_target-' + i}
							className={handleType}
							type="target"
							position={targetPos}
							isConnectable
							style={getHandleStyle(targetPos, targetHandles, i, getHandleColor('target-' + i))}
						/>
					))}
			</div>
			{!susiData.hasValidInputs && <div className="invalid-input-warning-icon">⚠️</div>}
		</>
	);
}

const MarkdownDefaultNode = ({ data, sourcePosition, targetPosition }: any) => {
	return MarkdownNode(data, sourcePosition, targetPosition);
};

export default memo(MarkdownDefaultNode);
