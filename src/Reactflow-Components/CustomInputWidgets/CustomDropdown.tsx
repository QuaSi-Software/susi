import { useState } from 'react';

interface CustomDropdownProps<T> {
	displayName: string;
	startValue: T;
	dropdown_options: T[];
	dropdown_options_display_names?: string[];
	onEdit: (value: T) => void;
}

function assertNoDuplicates(arr: Array<any>, arrayName: string) {
	arr.forEach((element) => {
		const equalElements = arr.filter((e) => e === element);
		console.assert(equalElements.length === 1, `Array ${arrayName} has duplicate element: ${element}`);
	});
}

const CustomDropdown = <T extends string | number>({
	displayName,
	startValue,
	dropdown_options,
	dropdown_options_display_names,
	onEdit,
}: CustomDropdownProps<T>) => {
	const [selectedOption, setInputValue] = useState<T>(startValue);
	const displayNames = dropdown_options_display_names || dropdown_options;
	assertNoDuplicates(dropdown_options, `Dropdown Options in ${displayName}`);

	const onOptionSelected = (value: T): void => {
		setInputValue(value);
		onEdit(value);
	};

	return (
		<div className="form-floating">
			<select
				className="form-select"
				id="floatingSelect"
				defaultValue={String(selectedOption)}
				aria-label="Floating label select"
				onChange={(e) => onOptionSelected(e.target.value as T)}
			>
				{dropdown_options.map((option, index) => (
					<option key={`${option}-${index}`} value={option}>
						{displayNames[index]}
					</option>
				))}
			</select>
			<label htmlFor="floatingSelect">{displayName}</label>
		</div>
	);
};

export default CustomDropdown;
