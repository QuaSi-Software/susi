interface NodeInput {
	type: string;
	resieName: string;
	editable: boolean;
	displayName: string;
	value: any;
	dropdownOptions: Array<string>;
	dropdownOptionDisplayNames: Array<string>;
	isMedium: boolean;
	tooltip: string;
	isIncluded: boolean;
}

const createNodeInput = (
	type: string,
	resieName: string,
	editable: boolean,
	displayName: string,
	value: any,
	dropdownOptions: Array<string>,
	dropdownOptionDisplayNames: Array<string>,
	isMedium: boolean,
	tooltip: string
) => {
	if (!type) type = typeof value;
	if (dropdownOptions.length > 0) {
		type = 'dropdown';
		if (!dropdownOptions.includes(value)) value = dropdownOptions[0];
	}

	let nodeInput: NodeInput = {
		type: type,
		resieName: resieName,
		editable: editable,
		displayName: displayName,
		value: value,
		dropdownOptions: dropdownOptions,
		dropdownOptionDisplayNames: dropdownOptionDisplayNames,
		isMedium: isMedium,
		tooltip: tooltip,
		isIncluded: true,
	};
	return nodeInput;
};

export { type NodeInput, createNodeInput };
