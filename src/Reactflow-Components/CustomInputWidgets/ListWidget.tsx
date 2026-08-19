import { useContext, useState } from 'react';
import '../../../src/CSS/Input-Widgets/list-widget.css';
import type { CustomInputFieldProps } from './CustomInputField';
import { InputObjectType } from './InputObject';
import { UacWidget } from './UacWidget';
import { Form, FloatingLabel } from 'react-bootstrap';
import { InputIssueType } from './Validation/InputChecking';
import { AppContext } from '../../AppContext';
import { Locale } from '../../Sidebar/SettingsMenu';

const DeletableListItem = ({
	value,
	index,
	onDelete,
}: {
	value: any;
	index: number;
	onDelete: (value: any, index: number) => void;
}) => {
	return (
		<div key={`item-${index}-${value}`} className="list-item">
			<div title={value}>{value}</div>
			<button onClick={() => onDelete(value, index)}> x </button>
		</div>
	);
};

const ListWidget = ({ nodeInput, onEdit, nodeId }: CustomInputFieldProps) => {
	const listValues = nodeInput.value;
	console.assert(Array.isArray(listValues), `Node Input passed to ListWidget must be a list`);
	if (!Array.isArray(listValues)) return;
	const [editingValue, setEditingValue] = useState<string | number>();
	const disabledByMutex = nodeInput.issue.issueType === InputIssueType.Mutex;
	const appContext = useContext(AppContext);
	const locale = appContext?.locale || Locale.US;
	const valueIsInvalid = false;

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
		if (nodeInput.type === InputObjectType.VECTOR_FLOAT && Number.isNaN(Number.parseFloat(value))) return;
		const newList: (string | number)[] = Object.assign([], listValues);
		newList.push(value);
		onEdit(nodeInput.resieName, newList);
		setEditingValue('');
	}
	function updateWidgetValue(newValue: string) {
		newValue = newValue.replaceAll('\n', '');
		setEditingValue(newValue);
	}
	function isValidNumber(value: string | number | undefined, disabledByMutex: boolean = false): boolean {
		return (
			(!nodeInput.isRequired && !nodeInput.isIncluded) ||
			!Number.isNaN(Number.parseFloat(value as string)) ||
			disabledByMutex
		);
	}

	return (
		<>
			{/** section with list items */}
			<div className="list-item-container">
				{listValues.map((item, index) => (
					<DeletableListItem value={item} index={index} onDelete={deleteItem} />
				))}
			</div>
			{/** Input widget */
			/** If it's a list of uac components, add a uac widget. When you select a new uac, add
			it to the list */}
			{nodeInput.type === InputObjectType.COMPONENT_UAC_LIST && (
				<UacWidget
					nodeId={nodeId}
					value={editingValue as string}
					onInputChanged={addItem}
					displayName={`Add value to ${nodeInput.displayName}`}
				/>
			)}
			{nodeInput.type === InputObjectType.VECTOR_STRING && (
				<FloatingLabel controlId="floatingInput" label={nodeInput.displayName}>
					<Form.Control
						type="text"
						as="textarea"
						style={{ height: '60px' }}
						placeholder={nodeInput.displayName}
						value={String(editingValue)}
						onChange={(e) => updateWidgetValue(e.target.value)}
						disabled={disabledByMutex}
						onKeyDown={(e) => (e.key === 'Enter' ? addItem(editingValue) : null)}
					/>
				</FloatingLabel>
			)}
			{nodeInput.type === InputObjectType.VECTOR_FLOAT && (
				<FloatingLabel controlId="floatingInput" label={nodeInput.displayName}>
					<Form.Control
						type="number"
						placeholder={nodeInput.displayName}
						value={editingValue}
						onChange={(e) => updateWidgetValue(e.target.value)}
						step="0.01"
						lang={locale}
						isInvalid={!isValidNumber(editingValue, disabledByMutex)}
						disabled={disabledByMutex}
						onKeyDown={(e) => (e.key === 'Enter' ? addItem(editingValue) : null)}
					/>
					<label htmlFor="floatingInput" id="unit-label">
						{nodeInput.unit}
					</label>
				</FloatingLabel>
			)}
		</>
	);
};

export default ListWidget;
