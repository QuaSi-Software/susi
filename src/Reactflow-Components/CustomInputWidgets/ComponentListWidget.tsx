import '../../../src/CSS/Input-Widgets/list-widget.css';
import type { CustomInputFieldProps } from './CustomInputField';
import { InputObjectType } from './InputObject';
import { UacWidget } from './UacWidget';
import { useReactFlow } from '@xyflow/react';

const DeletableListItem = ({
	value,
	index,
	onDelete,
	displayValue,
}: {
	value: any;
	index: number;
	onDelete: (value: any, index: number) => void;
	displayValue?: string;
}) => {
	if (!displayValue) displayValue = value;
	return (
		<div key={`item-${index}-${value}`} className="list-item">
			<div title={displayValue}>{displayValue}</div>
			<button onClick={() => onDelete(value, index)}> x </button>
		</div>
	);
};

const ComponentListWidget = ({ nodeInput, onEdit, nodeId }: CustomInputFieldProps) => {
	let listValues = nodeInput.value;
	console.assert(Array.isArray(listValues), `Node Input passed to ListWidget must be a list`);
	if (!Array.isArray(listValues)) return;
	const allNodes = useReactFlow()
		.getNodes()
		.filter((n) => n.type !== 'group');

	function deleteItem(value: string | number, index: number) {
		let newList: Array<string | number> = Object.assign([], listValues);
		const deletedItem = newList.splice(index, 1);
		if (deletedItem[0] !== value) {
			console.warn(
				`Attempting to delete item at index ${index} with value ${value}, but item's value is actually ${deletedItem[0]}`
			);
			return;
		}
		onEdit(nodeInput.resieName, newList);
	}
	function addItem(value: any) {
		if (value === 'None') return;
		const newList: (string | number)[] = Object.assign([], listValues);
		newList.push(value);
		onEdit(nodeInput.resieName, newList);
	}

	const excludedNodeIds = listValues;
	if (nodeId) excludedNodeIds.concat(nodeId);
	return (
		<>
			{/** section with list items */}
			<div className="list-item-container">
				{listValues.map((item, index) => (
					<DeletableListItem
						value={item}
						index={index}
						onDelete={deleteItem}
						/** if it's a uac, we should display the node name, not the id */
						displayValue={
							nodeInput.type === InputObjectType.COMPONENT_UAC_LIST
								? allNodes.find((n) => n.id === item)?.data.content
								: item
						}
					/>
				))}
			</div>
			{/** Input widget */
			/** If it's a list of uac components, add a uac widget. When you select a new uac, add
			it to the list */}
			<UacWidget
				excludedNodeIds={excludedNodeIds}
				value={'None'}
				onInputChanged={addItem}
				displayName={`Add value to ${nodeInput.displayName}`}
			/>
		</>
	);
};

export default ComponentListWidget;
