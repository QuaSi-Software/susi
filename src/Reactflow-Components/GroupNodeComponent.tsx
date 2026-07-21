import { memo } from 'react';
import { NodeResizer } from '@xyflow/react';
import type { SusiNodeData } from '../NodeDataStructures/Nodes/SusiNodeData';

export const minGroupNodeSize = {
	width: 120,
	height: 120,
};

const GroupNodeComponent = ({ data, selected }: { data: SusiNodeData; selected: boolean }) => {
	return (
		<>
			<NodeResizer
				color="#1ee5ff"
				isVisible={selected}
				minWidth={minGroupNodeSize.width}
				minHeight={minGroupNodeSize.height}
			/>
			<div style={{ padding: '0.5em', fontSize: '12px', position: 'absolute', top: 0, left: 0 }}>
				{data.content}
			</div>
		</>
	);
};

export default memo(GroupNodeComponent);
