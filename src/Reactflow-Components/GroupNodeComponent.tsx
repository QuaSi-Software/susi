import { memo } from 'react';
import { NodeResizer } from '@xyflow/react';

const GroupNodeComponent = ({ data, selected }: any) => {
	return (
		<>
			<NodeResizer color="#ff0071" isVisible={selected} minWidth={200} minHeight={150} />
			<div style={{ padding: 10, width: '100%', height: '100%', minHeight: 150 }}>{data.label}</div>
		</>
	);
};

export default memo(GroupNodeComponent);
