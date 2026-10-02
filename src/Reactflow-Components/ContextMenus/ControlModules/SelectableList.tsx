import { type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { Button } from 'react-bootstrap';

interface ListItem {
	title: string;
	key: string;
}

interface SelectableListProps {
	items: ListItem[];
	onDelete: (key: string) => void;
	children?: ReactNode;
	selectedKey: string;
	setSelectedKey: Dispatch<SetStateAction<string>>;
}

export function SelectableList({ items, onDelete, children, selectedKey, setSelectedKey }: SelectableListProps) {
	const selectedModuleColor = '#c5d0eb';
	return (
		<div className="controle-module-list">
			<div className="modal-subheading">Modules on this Component</div>
			{items.map((item, index) => (
				<div
					key={`controle-module-${index}`}
					className="controle-module-item"
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
