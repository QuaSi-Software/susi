import { Button, Form } from 'react-bootstrap';
import type { CustomInputFieldProps } from './CustomInputField';
import { InputObjectType } from './InputObject';
import { useContext } from 'react';
import { AppContext } from '../../AppContext';
import { Locale } from '../../Sidebar/SettingsMenu';

function ListItem({
	value,
	inputType,
	onInputChange,
	onDelete,
}: {
	value: string | number;
	inputType: InputObjectType;
	onInputChange: (value: string) => void;
	onDelete: () => void;
}) {
	const appContext = useContext(AppContext);
	const locale = appContext?.locale || Locale.US;

	return (
		<div className="list-item">
			{inputType === InputObjectType.STRING && (
				<Form.Control
					type="text"
					as="textarea"
					style={{ height: '1em' }}
					value={String(value)}
					onChange={(e) => onInputChange(e.target.value)}
				/>
			)}
			{inputType === InputObjectType.FLOAT && (
				<Form.Control
					type="number"
					value={value}
					onChange={(e) => onInputChange(e.target.value)}
					step="0.01"
					lang={locale}
					isValid={!Number.isNaN(Number.parseFloat(value as string))}
				/>
			)}
			<button onClick={onDelete} style={{ fontSize: '1.25em', alignContent: 'center' }}>
				<i className="bi bi-x"></i>
			</button>
		</div>
	);
}

export function ListWidget({ nodeInput, onEdit }: CustomInputFieldProps) {
	const listValues: string[] = nodeInput.value;
	console.assert(Array.isArray(listValues), `Node Input passed to ListWidget must be a list`);
	if (!Array.isArray(listValues)) return;
	const itemType = nodeInput.type === InputObjectType.VECTOR_STRING ? InputObjectType.STRING : InputObjectType.FLOAT;

	function onItemChange(index: number, value: string) {
		const newList: string[] = Object.assign([], listValues);
		newList[index] = value;
		onEdit(nodeInput.resieName, newList);
	}
	function onItemDelete(index: number) {
		const newList = Object.assign([], listValues);
		newList.splice(index, 1);
		onEdit(nodeInput.resieName, newList);
	}
	function addItem() {
		const newList: string[] = Object.assign([], listValues);
		newList.push(itemType === InputObjectType.STRING ? '' : '0');
		onEdit(nodeInput.resieName, newList);
	}

	return (
		<>
			{/** title */}
			<div>{nodeInput.displayName}</div>
			{/** array of input fields */}
			{listValues.map((input, index) => (
				<div className="list-item-container">
					<ListItem
						value={input}
						inputType={itemType}
						onInputChange={(value: string) => onItemChange(index, value)}
						onDelete={() => onItemDelete(index)}
					/>
				</div>
			))}
			{/** add button */}
			<Button variant="primary" onClick={addItem} style={{ fontSize: '1.25em', padding: '0em 0.4em' }}>
				<i className="bi bi-plus-lg"></i>
			</Button>
		</>
	);
}
