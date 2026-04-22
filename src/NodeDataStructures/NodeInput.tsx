import type { Medium } from './Medium';

const NodeInputType = {
	NUMBER: 'NUMBER',
	STRING: 'STRING',
	DROPDOWN: 'DROPDOWN',
	MEDIUM: 'MEDIUM',
	BOOLEAN: 'BOOLEAN',
	UNSET: 'UNSET',
} as const;

type NodeInputType = (typeof NodeInputType)[keyof typeof NodeInputType];

const getNodeInputType = (value: any, dropdownOptions: string[]) => {
	if (dropdownOptions.length > 0) return NodeInputType.DROPDOWN;
	switch (typeof value) {
		case 'string':
			return NodeInputType.STRING;
		case 'number':
			return NodeInputType.NUMBER;
		case 'boolean':
			return NodeInputType.BOOLEAN;
	}
	console.error(`Node Input value has unsupported type: ${typeof value}`);
	return NodeInputType.UNSET;
};

interface NodeInput {
	type: NodeInputType;
	resieName: string;
	displayName: string;
	value: any;
	tooltip: string;
	editable: boolean;
	isRequired: boolean;
	isIncluded: boolean;
	dropdownOptions: Array<string>;
	dropdownOptionDisplayNames: Array<string>;
}

const createNodeInput = (
	type: NodeInputType | null,
	resieName: string,
	displayName: string,
	value: any,
	tooltip: string = '',
	/** Different input types */
	editable: boolean = true,
	isRequired: boolean = true,
	/** Dropdown Options */
	dropdownOptions: Array<string> = [],
	dropdownOptionDisplayNames: Array<string> = []
) => {
	if (!type) type = getNodeInputType(value, dropdownOptions);
	if (dropdownOptions.length > 0) {
		if (!dropdownOptions.includes(value)) value = dropdownOptions[0];
	}

	let nodeInput: NodeInput = {
		type: type,
		resieName: resieName,
		displayName: displayName,
		value: value,
		tooltip: tooltip,
		editable: editable,
		isRequired: isRequired,
		isIncluded: true,
		dropdownOptions: dropdownOptions,
		dropdownOptionDisplayNames: dropdownOptionDisplayNames,
	};
	return nodeInput;
};

const setNodeInputValue = (nodeInput: NodeInput, value: any, mediums: Medium[]): void => {
	if (nodeInput.type === NodeInputType.MEDIUM) {
		const mediumWithKey = mediums.find((m) => m.key === value);
		if (mediumWithKey === undefined) {
			const mediumWithName = mediums.find((m) => m.name === value);
			value = mediumWithName?.key || 'UNDEFINED';
		}
	}
	nodeInput.value = value;
};

export { type NodeInput, createNodeInput, NodeInputType, setNodeInputValue };
