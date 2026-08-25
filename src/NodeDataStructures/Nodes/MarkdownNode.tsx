import { memo } from 'react';
import { Position } from '@xyflow/react';
import Markdown from 'react-markdown';
import type { SusiNodeData } from './SusiNodeData';
import { CustomHandle } from './CustomHandle';

const MemoizedMarkdown = memo(({ content }: { content: string }) => <Markdown>{content}</Markdown>);

function MarkdownNode(susiData: SusiNodeData, sourcePosition: boolean, targetPosition: boolean) {
	const sourceHandles = susiData.sourceHandles !== undefined ? susiData.sourceHandles : 0;
	const targetHandles = susiData.targetHandles !== undefined ? susiData.targetHandles : 0;
	const sourcePos = sourcePosition && Position.Right;
	const targetPos = targetPosition && Position.Left;

	return (
		<>
			<div className="node-handles">
				{sourcePos &&
					[...Array(sourceHandles)].map((_, i) => (
						<CustomHandle
							sourceOrTarget="source"
							handleIndex={i}
							susiData={susiData}
							numHandles={sourceHandles}
							position={sourcePos}
							key={susiData.content + '_source-' + i}
						/>
					))}
			</div>

			<div className="markdown-node">
				<MemoizedMarkdown content={susiData.content} />
			</div>

			<div className="node-handles">
				{targetPos &&
					[...Array(targetHandles)].map((_, i) => (
						<CustomHandle
							sourceOrTarget="target"
							handleIndex={i}
							susiData={susiData}
							numHandles={targetHandles}
							position={targetPos}
							key={susiData.content + '_target-' + i}
						/>
					))}
			</div>
			{(!susiData.hasValidInputs || !susiData.hasValidName) && (
				<div className="invalid-input-warning-icon">⚠️</div>
			)}
		</>
	);
}

const MarkdownDefaultNode = ({ data, sourcePosition, targetPosition }: any) => {
	return MarkdownNode(data, sourcePosition, targetPosition);
};

export default memo(MarkdownDefaultNode);
