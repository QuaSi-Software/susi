interface NodeInput {
	type: string;
	resieName: string;
	displayName: string;
	value: any;
	tooltip: string;
	editable: boolean;
	isMedium: boolean;
	isRequired: boolean;
	isIncluded: boolean;
	dropdownOptions: Array<string>;
	dropdownOptionDisplayNames: Array<string>;
}

const createNodeInput = (
	type: string,
	resieName: string,
	displayName: string,
	value: any,
	tooltip: string,
	/** Different input types */
	editable: boolean,
	isMedium: boolean,
	isRequired: boolean,
	/** Dropdown Options */
	dropdownOptions: Array<string>,
	dropdownOptionDisplayNames: Array<string>
) => {
	if (!type) type = typeof value;
	if (dropdownOptions.length > 0) {
		type = 'dropdown';
		if (!dropdownOptions.includes(value)) value = dropdownOptions[0];
	}

	let nodeInput: NodeInput = {
		type: type,
		resieName: resieName,
		displayName: displayName,
		value: value,
		tooltip: tooltip,
		editable: editable,
		isMedium: isMedium,
		isRequired: isRequired,
		isIncluded: true,
		dropdownOptions: dropdownOptions,
		dropdownOptionDisplayNames: dropdownOptionDisplayNames,
	};
	return nodeInput;
};

export { type NodeInput, createNodeInput };
