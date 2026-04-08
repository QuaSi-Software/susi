import React from 'react';
import { useDnD } from '../DnDContext';
import { getNodeTypesInCategory, NodeCategory, type NodeType } from '../Nodes/SusiNodeTypes';

export default () => {
	const [_, setType] = useDnD();

	const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType) => {
		setType!(nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	const nodeCategories = Object.values(NodeCategory);
	return (
		<>
			{nodeCategories.map((category: string) => (
				<div key={category}>
					<div className="description">{category}</div>
					{getNodeTypesInCategory(category as NodeCategory).map((nodeType) => (
						<div
							key={nodeType.type_name}
							className="dndnode"
							onDragStart={(event) => onDragStart(event, nodeType)}
							draggable
							style={{ '--category': category.toLowerCase() } as React.CSSProperties}
						>
							{nodeType.button_name}
						</div>
					))}
				</div>
			))}
		</>
	);
};
