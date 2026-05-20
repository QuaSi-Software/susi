import { useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { FloatLabel } from 'primereact/floatlabel';

export interface CustomMultiSelectProps {
	displayName: string;
	startValues: string[];
	dropdown_options: string[];
	dropdown_options_display_names?: string[];
	onEdit: (newInput: string[]) => void;
}
interface MultiselectOption {
	label: string;
	value: string;
}

export const Multiselect: React.FC<CustomMultiSelectProps> = ({
	displayName,
	startValues,
	dropdown_options,
	dropdown_options_display_names,
	onEdit,
}) => {
	const displayNames = dropdown_options_display_names || dropdown_options;
	const options = getOptions();
	const [selectedOptions, setInputValue] = useState<string[]>(startValues || []);

	function getOptions() {
		const options: MultiselectOption[] = [];
		for (let i = 0; i < displayNames!.length; i++) {
			const displayName = displayNames![i];
			const value = dropdown_options![i];
			options.push({
				value: value,
				label: displayName,
			});
		}
		return options;
	}

	const onChange = (newValues: string[]) => {
		setInputValue(newValues);
		onEdit(newValues);
	};

	return (
		<FloatLabel className="p-fluid">
			<MultiSelect
				value={selectedOptions || []}
				onChange={(e) => onChange(e.value || [])}
				options={options}
				optionLabel="label"
				optionValue="value"
				id="floatingMultiSelect"
			/>
			<label htmlFor="floatingMultiSelect" id="floating-label">
				{displayName}
			</label>
		</FloatLabel>
	);
};
