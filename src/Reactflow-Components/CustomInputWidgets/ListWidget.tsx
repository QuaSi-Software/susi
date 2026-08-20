import { Button, Form } from 'react-bootstrap';
import type { CustomInputFieldProps } from './CustomInputField';
import { InputObjectType } from './InputObject';
import { useContext, useState } from 'react';
import { AppContext } from '../../AppContext';
import { Locale } from '../../Sidebar/SettingsMenu';
import { useMotionValue, Reorder } from 'framer-motion';
import { useRaisedShadow } from '../BusDataWidget/use-raised-shadow';

function ListItem({
	value: item,
	inputType,
	onInputChange,
	onDelete,
}: {
	value: ListItemObject;
	inputType: InputObjectType;
	onInputChange: (value: string) => void;
	onDelete: () => void;
}) {
	const appContext = useContext(AppContext);
	const locale = appContext?.locale || Locale.US;

	const y = useMotionValue<number>(0);
	const boxShadow = useRaisedShadow(y);

	return (
		<Reorder.Item value={item} id={item.key as string} style={{ boxShadow, y }} className="list-item">
			<i className="bi bi-grip-vertical drag-icon"></i>
			{inputType === InputObjectType.STRING && (
				<Form.Control
					type="text"
					as="textarea"
					style={{ height: '1em' }}
					value={String(item.value)}
					onChange={(e) => onInputChange(e.target.value)}
				/>
			)}
			{inputType === InputObjectType.FLOAT && (
				<Form.Control
					type="number"
					value={item.value}
					onChange={(e) => onInputChange(e.target.value)}
					step="0.01"
					lang={locale}
					isValid={!Number.isNaN(Number.parseFloat(item.value as string))}
				/>
			)}
			<button onClick={onDelete} style={{ fontSize: '1.25em', alignContent: 'center' }}>
				<i className="bi bi-x"></i>
			</button>
		</Reorder.Item>
	);
}

/** List Item Object is created with a unique key,
 * so the value can be changed and the reorder group can still have
 * a unique identifier for each input field. The index and value both don't work
 * as unique keys, because if the value is used, the autofocus when changing the input field deselects when the key changes*/
interface ListItemObject {
	value: string;
	key: string;
}

export function ListWidget({ nodeInput, onEdit }: CustomInputFieldProps) {
	const initialValues: string[] = nodeInput.value;
	console.assert(Array.isArray(initialValues), `Node Input passed to ListWidget must be a list`);
	if (!Array.isArray(initialValues)) return;
	const itemType = nodeInput.type === InputObjectType.VECTOR_STRING ? InputObjectType.STRING : InputObjectType.FLOAT;

	const [listValues, setListValues] = useState<ListItemObject[]>(
		initialValues.map((e, index) => ({ value: e, key: `key-${e}-${index}` }))
	);

	function onItemChange(index: number, value: string) {
		const newList = [...listValues];
		newList[index].value = value;
		setListValues(newList);
		onEdit(
			nodeInput.resieName,
			newList.map((e) => e.value)
		);
	}
	function onItemDelete(index: number) {
		const newList = [...listValues];
		newList.splice(index, 1);
		setListValues(newList);
		onEdit(
			nodeInput.resieName,
			newList.map((e) => e.value)
		);
	}
	function addItem() {
		const newList = [...listValues];
		newList.push({ value: itemType === InputObjectType.STRING ? '' : '0', key: `key-${Date.now()}` });
		setListValues(newList);
		onEdit(
			nodeInput.resieName,
			newList.map((e) => e.value)
		);
	}
	function onReorder(order: ListItemObject[]) {
		setListValues(order);
		onEdit(nodeInput.resieName, order);
	}

	return (
		<>
			{/** title */}
			<div>{nodeInput.displayName}</div>
			{/** array of input fields */}
			<Reorder.Group axis="y" values={listValues} onReorder={onReorder} className="list-item-container">
				{listValues.map((input, index) => (
					<ListItem
						key={`list-item-${input.key}`}
						value={input}
						inputType={itemType}
						onInputChange={(value: string) => onItemChange(index, value)}
						onDelete={() => onItemDelete(index)}
					/>
				))}
			</Reorder.Group>
			{/** add button */}
			<Button variant="primary" onClick={addItem} style={{ fontSize: '1.25em', padding: '0em 0.4em' }}>
				<i className="bi bi-plus-lg"></i>
			</Button>
		</>
	);
}
