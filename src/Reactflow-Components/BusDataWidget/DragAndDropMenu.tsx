import { useState } from 'react';
import { useMotionValue, Reorder } from 'framer-motion';
import { useRaisedShadow } from './use-raised-shadow';
import './reorder-styles.css';
import React from 'react';

interface DragAndDropMenuProps {
	title: string;
	nodeNames: string[];
	onOrderChange: (order: string[]) => void;
}

interface ItemProps {
	item: string;
}

const DragAndDropMenu: React.FC<DragAndDropMenuProps> = ({ title, nodeNames, onOrderChange }) => {
	const [items, setItems] = useState<string[]>(nodeNames);

	const onReorder = (order: string[]): void => {
		setItems(order);
		onOrderChange(order);
	};

	return (
		<div className="drag-drop-menu">
			<header>{title}</header>
			<Reorder.Group axis="y" values={items} onReorder={onReorder}>
				{items.map((nodeName) => (
					<Item key={nodeName} item={nodeName} />
				))}
			</Reorder.Group>
		</div>
	);
};

const Item: React.FC<ItemProps> = ({ item }) => {
	const y = useMotionValue<number>(0);
	const boxShadow = useRaisedShadow(y);

	return (
		<Reorder.Item value={item} id={item} style={{ boxShadow, y }}>
			<span>{item}</span>
		</Reorder.Item>
	);
};

export default DragAndDropMenu;
export { Item };
