import { memo, useEffect } from 'react';
import { NodeResizer, NodeToolbar, useReactFlow } from '@xyflow/react';
import type { SusiNodeData } from '../Nodes/SusiNodeData';

export const minGroupNodeSize = {
	width: 120,
	height: 120,
};

const styles = {
	toolbar: {
		display: 'flex',
		gap: '0.25rem',
		borderRadius: '0.5rem',
		border: '1px solid #e5e5e5',
		backgroundColor: 'white',
		padding: '0.5rem',
		boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
	},
	colorButton: {
		height: '1.5rem',
		width: '1.5rem',
		borderRadius: '9999px',
		border: 'none',
		cursor: 'pointer',
		transition: 'transform 0.15s ease-in-out',
	},
	colorButtonHover: {
		transform: 'scale(1.1)',
	},
	outerContainer: {
		display: 'flex',
		height: '100%',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: '5%',
	},
} as const;

const colorOptions = [
	'#525f703c', // gray
	'#f5efe951', // very light warm grey
	'#8e12122d', // red
	'#eab2085f', // yellow
	'#22c55e4f', // green
	'#3b83f649', // blue
];

const GroupNodeComponent = ({
	id,
	data,
	selected,
	dragging,
}: {
	id: string;
	data: SusiNodeData;
	selected: boolean;
	dragging: boolean;
}) => {
	const { updateNodeData, setNodes } = useReactFlow();
	const colorIndex = data.colorIndex ?? 0;

	useEffect(() => {
		setNodes((nodes) => nodes.map((node) => (node.parentId === id ? { ...node, expandParent: selected } : node)));
	}, [selected, id, setNodes]);

	return (
		<>
			<NodeToolbar isVisible={selected && !dragging} className="nopan">
				<div style={styles.toolbar}>
					{colorOptions.map((colorOption, index) => (
						<button
							key={colorOption}
							onClick={() => updateNodeData(id, { colorIndex: index })}
							style={{
								...styles.colorButton,
								backgroundColor: colorOption,
								border: index === colorIndex ? '2px black solid' : '1px #c0c0c0 solid',
							}}
							title={`Set color to ${colorOption}`}
						/>
					))}
				</div>
			</NodeToolbar>
			<NodeResizer
				color="#1ee5ff"
				isVisible={selected}
				minWidth={minGroupNodeSize.width}
				minHeight={minGroupNodeSize.height}
			/>
			<div style={{ ...styles.outerContainer, backgroundColor: colorOptions[colorIndex] }} />
			<div style={{ padding: '0.5em', fontSize: '12px', position: 'absolute', top: 0, left: 0 }}>
				{data.content}
			</div>
			{(!data.hasValidInputs || !data.hasValidName) && <div className="invalid-input-warning-icon">⚠️</div>}
		</>
	);
};

export default memo(GroupNodeComponent);
