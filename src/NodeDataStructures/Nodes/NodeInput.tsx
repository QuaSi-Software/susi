import { getUndefinedMedium } from '../Mediums/MediumUtils';
import type { Medium } from '../Mediums/Medium';

const NodeInputType = {
	INT: 'INT',
	FLOAT: 'FLOAT',
	STRING: 'STRING',
	DROPDOWN: 'DROPDOWN',
	MEDIUM: 'MEDIUM',
	BOOLEAN: 'BOOLEAN',
	MULTISELECT: 'MULTISELECT',
	UNSET: 'UNSET',
} as const;

type NodeInputType = (typeof NodeInputType)[keyof typeof NodeInputType];

const isSubsetOf = (arr: any[], subset: any[]) => {
	for (let i = 0; i < subset.length; i++) {
		const element = subset[i];
		if (!arr.includes(element)) return false;
	}
	return true;
};

class NodeInput {
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

	constructor(
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
	) {
		if (!type) type = this.getNodeInputType(value, dropdownOptions);
		if (type === NodeInputType.DROPDOWN) {
			if (!dropdownOptions.includes(value)) value = dropdownOptions[0];
		} else if (type === NodeInputType.MULTISELECT) {
			if (!Array.isArray(value)) {
				console.error(`For MultiSelect Inputs, the starting value should be an array.`);
				value = [];
			}
			if (!isSubsetOf(dropdownOptions, value)) {
				console.error(
					`The starting value of ${displayName} MultiSelect is ${value}, which is not a subset of the options: ${dropdownOptions}`
				);
				value = [];
			}
		}

		this.type = type;
		this.resieName = resieName;
		this.displayName = displayName;
		this.value = value;
		this.tooltip = tooltip;
		this.editable = editable;
		this.isRequired = isRequired;
		this.isIncluded = true;
		this.dropdownOptions = dropdownOptions;
		this.dropdownOptionDisplayNames = dropdownOptionDisplayNames;
	}

	public setNodeInputValue = (value: any, mediums: Medium[]): void => {
		if (this.type === NodeInputType.MEDIUM) {
			const mediumWithKey = mediums.find((m) => m.key === value);
			if (mediumWithKey === undefined) {
				const mediumWithName = mediums.find((m) => m.name === value);
				value = mediumWithName?.key || getUndefinedMedium().key;
			}
		}
		this.value = value;
	};
	public getNodeInputExportValue = (mediums: Medium[]): any => {
		console.log('In getNodeInputExportValue: ' + this.value);
		if (this.type === NodeInputType.MEDIUM) {
			const mediumKey = this.value;
			const medium = mediums.find((m) => m.key === mediumKey);
			if (!medium) return 'UNDEFINED';
			return medium.name;
		}
		return this.value;
	};
	public copy = (): NodeInput => {
		return new NodeInput(
			this.type,
			this.resieName,
			this.displayName,
			this.value,
			this.tooltip,
			this.editable,
			this.isRequired,
			this.dropdownOptions,
			this.dropdownOptionDisplayNames
		);
	};

	private getNodeInputType = (value: any, dropdownOptions: string[]) => {
		if (dropdownOptions.length > 0) return NodeInputType.DROPDOWN;
		switch (typeof value) {
			case 'string':
				return NodeInputType.STRING;
			case 'number':
				return NodeInputType.INT;
			case 'boolean':
				return NodeInputType.BOOLEAN;
		}
		console.error(`Node Input value has unsupported type: ${typeof value}`);
		return NodeInputType.UNSET;
	};
}

export { NodeInput, NodeInputType };
