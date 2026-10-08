import { type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { Button } from 'react-bootstrap';

interface SelectableListProps<T> {
	title: string;
	items: {
		title: string;
		key: T;
	}[];
	onDelete: (key: T) => void;
	children?: ReactNode;
	selectedKey?: T;
	setSelectedKey: Dispatch<SetStateAction<T>>;
}

export function SelectableList<T>({
	title,
	items,
	onDelete,
	children,
	selectedKey,
	setSelectedKey,
}: SelectableListProps<T>) {
	const selectedModuleColor = '#c5d0eb';
	return (
		<div className="selectable-list">
			<div className="modal-subheading">{title}</div>
			{items.map((item, index) => (
				<div
					key={`selectable-list-${index}`}
					className="selectable-list-item"
					style={item.key === selectedKey ? { backgroundColor: selectedModuleColor } : {}}
				>
					<div onClick={() => setSelectedKey(item.key!)} style={{ flexGrow: 1, paddingRight: '2em' }}>
						{item.title}
					</div>
					<Button variant="danger" size="sm" onClick={() => onDelete(item.key)}>
						Delete
					</Button>
				</div>
			))}
			{children}
		</div>
	);
}
