import { useState } from 'react';
import React from 'react';

interface CustomDropdownProps {
	displayName: string;
	startValue: string | number | boolean;
	dropdown_options: string[];
	dropdown_options_display_names?: string[];
	onEdit: (value: string | number | boolean) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
	displayName,
	startValue,
	dropdown_options,
	dropdown_options_display_names,
	onEdit,
}) => {
	const [selectedOption, setInputValue] = useState<string | number | boolean>(startValue);
	const displayNames = dropdown_options_display_names || dropdown_options;

	const onOptionSelected = (value: string): void => {
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
				onChange={(e) => onOptionSelected(e.target.value)}
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
