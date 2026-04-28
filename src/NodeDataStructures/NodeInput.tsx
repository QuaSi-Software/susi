import { getUndefinedMedium } from '../Sidebar/Mediums/MediumUtils';
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
		if (dropdownOptions.length > 0) {
			if (!dropdownOptions.includes(value)) value = dropdownOptions[0];
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
				return NodeInputType.NUMBER;
			case 'boolean':
				return NodeInputType.BOOLEAN;
		}
		console.error(`Node Input value has unsupported type: ${typeof value}`);
		return NodeInputType.UNSET;
	};
}

export { NodeInput, NodeInputType };
