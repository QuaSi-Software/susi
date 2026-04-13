import { useState, useContext } from 'react';
import { useMotionValue, Reorder } from 'framer-motion';
import { useRaisedShadow } from './use-raised-shadow';
import { AppContext } from '../AppContext';
import './reorder-styles.css';
import React from 'react';

interface DragAndDropMenuProps {
	title: string;
	nodeNames: string[];
	onOrderChange: (order: string[]) => void;
}

interface ItemProps {
	item: string;
	theme?: string;
}

const DragAndDropMenu: React.FC<DragAndDropMenuProps> = ({ title, nodeNames, onOrderChange }) => {
	const [items, setItems] = useState<string[]>(nodeNames);
	const appContext = useContext(AppContext);
	const theme = appContext?.theme || 'light';

	const onReorder = (order: string[]): void => {
		setItems(order);
		onOrderChange(order);
	};

	return (
		<div className="drag-drop-menu" data-theme={theme}>
			<header>{title}</header>
			<Reorder.Group axis="y" values={items} onReorder={onReorder}>
				{items.map((nodeName) => (
					<Item key={nodeName} item={nodeName} theme="dark" />
				))}
			</Reorder.Group>
		</div>
	);
};

const Item: React.FC<ItemProps> = ({ item, theme }) => {
	const y = useMotionValue<number>(0);
	const boxShadow = useRaisedShadow(y);
	const appContext = useContext(AppContext);
	const actualTheme = theme || appContext?.theme || 'light';

	return (
		<Reorder.Item value={item} id={item} style={{ boxShadow, y }} data-theme={actualTheme}>
			<span>{item}</span>
		</Reorder.Item>
	);
};

export default DragAndDropMenu;
export { Item };
