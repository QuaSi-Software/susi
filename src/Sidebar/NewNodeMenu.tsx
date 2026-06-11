import React from 'react';
import { useDnD } from './DnDContext';
import { type NodeType } from '../NodeDataStructures/Nodes/SusiNodeTypes';
import type { ApiCategory } from '../FetchingApiData/ApiData';

export interface NewNodeMenuProps {
	categories: ApiCategory[];
	nodeTypes: Record<string, NodeType> | null;
}

export default function NewNodeMenu({ categories, nodeTypes }: NewNodeMenuProps) {
	if (nodeTypes === null) return <></>;
	const [_, setType] = useDnD();

	const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType) => {
		setType!(nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	categories = categories.sort((a, b) => a.index - b.index);
	return (
		<>
			<div className="sidebar-heading">Components </div>
			{categories.map((category: ApiCategory) => (
				<div key={category.heading}>
					<div className="sidebar-subheading">{category.heading}</div>
					{category.types!.map((nodeTypeName) => (
						<div
							key={nodeTypes[nodeTypeName].type_name}
							className="dndnode"
							onDragStart={(event) => onDragStart(event, nodeTypes[nodeTypeName])}
							draggable
							style={{ '--category': category.heading.toLowerCase() } as React.CSSProperties}
						>
							{nodeTypes[nodeTypeName].button_name}
						</div>
					))}
				</div>
			))}
		</>
	);
}
