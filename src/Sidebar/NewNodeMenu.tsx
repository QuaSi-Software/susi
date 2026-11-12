import React from 'react';
import { useDnD } from './DnDContext';
import { type ComponentType } from '../NodeDataStructures/Nodes/SusiNodeTypes';
import type { ApiCategory } from '../FetchingApiData/ApiData';

declare const __APP_VERSION__: string;

export interface NewNodeMenuProps {
	categories: ApiCategory[];
	nodeTypes: Record<string, ComponentType> | null;
	resieVersion: string | undefined;
}

export default function NewNodeMenu({ categories, nodeTypes, resieVersion }: NewNodeMenuProps) {
	if (nodeTypes === null) return <></>;
	const [_, setType] = useDnD();

	const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: ComponentType) => {
		setType!(nodeType);
		event.dataTransfer.effectAllowed = 'move';
	};

	categories = categories.sort((a, b) => a.index - b.index);
	return (
		<>
			{resieVersion && <div className="version-text"> ReSiE Version: {resieVersion}</div>}
			<div className="version-text"> SUSI Version: {__APP_VERSION__}</div>
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
