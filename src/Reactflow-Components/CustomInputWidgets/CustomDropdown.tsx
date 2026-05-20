import { useState } from 'react';

interface CustomDropdownProps<T> {
	displayName: string;
	startValue: T;
	dropdown_options: T[];
	dropdown_options_display_names?: string[];
	onEdit: (value: T) => void;
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

	const onOptionSelected = (value: T): void => {
		console.log(`Dropdown value selected: ${value}`);
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
					<option key={option} value={option}>
						{displayNames[index]}
					</option>
				))}
			</select>
			<label htmlFor="floatingSelect">{displayName}</label>
		</div>
	);
};

export default CustomDropdown;
