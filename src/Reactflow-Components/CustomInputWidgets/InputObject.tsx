import { getUndefinedMedium } from '../../NodeDataStructures/Mediums/MediumUtils';
import type { Medium } from '../../NodeDataStructures/Mediums/Medium';

const InputObjectType = {
	INT: 'INT',
	FLOAT: 'FLOAT',
	STRING: 'STRING',
	DROPDOWN: 'DROPDOWN',
	MEDIUM: 'MEDIUM',
	BOOLEAN: 'BOOLEAN',
	MULTISELECT: 'MULTISELECT',
	VECTOR_FLOAT: 'VECTOR_FLOAT',
	VECTOR_STRING: 'VECTOR_STRING',
	DATE: 'DATE',
	UNSET: 'UNSET',
} as const;

type InputObjectType = (typeof InputObjectType)[keyof typeof InputObjectType];

const isSubsetOf = (arr: any[], subset: any[]) => {
	for (let i = 0; i < subset.length; i++) {
		const element = subset[i];
		if (!arr.includes(element)) return false;
	}
	return true;
};

export interface InputObjectProps {
	type: InputObjectType;
	resieName: string;
	displayName: string;
	value: any;
	tooltip?: string;
	unit?: string;
	isRequired?: boolean;
	isIncluded?: boolean;
	dropdownOptions?: Array<string>;
	dropdownOptionDisplayNames?: Array<string>;
}

class InputObject implements InputObjectProps {
	type: InputObjectType;
	resieName: string;
	displayName: string;
	value: any;
	tooltip: string = '';
	isRequired: boolean = true;
	isIncluded: boolean = true;
	dropdownOptions: Array<string> = [];
	dropdownOptionDisplayNames: Array<string> = [];
	unit: string = '';

	constructor(props: InputObjectProps) {
		this.type = props.type;

		this.resieName = props.resieName;
		this.displayName = props.displayName;
		this.value = props.value;
		if (props.tooltip) this.tooltip = props.tooltip;
		if (props.unit) this.unit = props.unit;
		if (props.isRequired) this.isRequired = props.isRequired;
		if (props.dropdownOptions) this.dropdownOptions = props.dropdownOptions;
		if (props.dropdownOptionDisplayNames) this.dropdownOptionDisplayNames = props.dropdownOptionDisplayNames;
		this.isIncluded = true;

		if (this.value === null && !this.isRequired) this.isIncluded = false;
		if (this.type === InputObjectType.DATE) {
			this.value = new Date(this.value);
		}

		if (this.type === InputObjectType.DROPDOWN) {
			if (!this.dropdownOptions.includes(this.value)) this.value = this.dropdownOptions[0];
		} else if (this.type === InputObjectType.MULTISELECT) {
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

	public setNodeInputValue(value: any, mediums: Medium[]): void {
		if (this.type === InputObjectType.MEDIUM) {
			const mediumWithKey = mediums.find((m) => m.key === value);
			if (mediumWithKey === undefined) {
				const mediumWithName = mediums.find((m) => m.name === value);
				value = mediumWithName?.key || getUndefinedMedium().key;
			}
		}
		this.value = value;
	}
	public getNodeInputExportValue(mediums: Medium[]): any {
		if (this.type === InputObjectType.MEDIUM) {
			const mediumKey = this.value;
			const medium = mediums.find((m) => m.key === mediumKey);
			if (!medium) return 'UNDEFINED';
			return medium.name;
		}
		return this.value;
	}
	public copy(): InputObject {
		return new InputObject(this);
	}
}

export { InputObject, InputObjectType };
