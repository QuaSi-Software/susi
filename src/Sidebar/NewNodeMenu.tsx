import React from 'react';
import { useDnD } from './DnDContext';
import { getNodeTypesInCategory, NodeCategory, type NodeType } from '../NodeDataStructures/Nodes/SusiNodeTypes';

export default () => {
	const [_, setType] = useDnD();

	const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType) => {
		setType!(nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	const nodeCategories = Object.values(NodeCategory);
	return (
		<>
			<div className="sidebar-heading">Components </div>
			{nodeCategories.map((category: string) => (
				<div key={category}>
					<div className="node-category-heading">{category}</div>
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
