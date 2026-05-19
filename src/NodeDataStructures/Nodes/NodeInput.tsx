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
	VECTOR_FLOAT: 'VECTOR_FLOAT',
	VECTOR_STRING: 'VECTOR_STRING',
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
		type: NodeInputType,
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

		if (this.value === null && !this.isRequired) this.isIncluded = false;

		if (this.type === NodeInputType.DROPDOWN) {
			if (!this.dropdownOptions.includes(this.value)) this.value = this.dropdownOptions[0];
		} else if (this.type === NodeInputType.MULTISELECT) {
			if (!Array.isArray(this.value)) {
				console.error(`For MultiSelect Inputs, the starting value should be an array.`);
				this.value = [];
			}
			if (!isSubsetOf(this.dropdownOptions, this.value)) {
				console.error(
					`The starting value of ${this.displayName} MultiSelect is ${this.value}, which is not a subset of the options: ${this.dropdownOptions}`
				);
				this.value = [];
			}
		}
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
}

export { NodeInput, NodeInputType };
