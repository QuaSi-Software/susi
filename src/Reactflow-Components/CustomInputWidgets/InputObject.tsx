import { getUndefinedMedium } from '../../NodeDataStructures/Mediums/MediumUtils';
import type { Medium } from '../../NodeDataStructures/Mediums/Medium';
import { type Validation } from './Validation/NumberValidation';
import { type Conditional } from './Validation/Conditionals';
import { checkForInputIssues, InputIssueType, type InputIssue } from './Validation/InputChecking';

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
	CUSTOM_OBJECT: 'CUSTOM_OBJECT',
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
	validations?: Array<Validation>;
	conditionals?: Conditional[];
	issue?: InputIssue;
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
	validations: Array<Validation> = [];
	validationMessages: string[] = [];
	conditionals: Conditional[] = [];
	issue: InputIssue = { issueType: InputIssueType.None, message: '' };

	constructor(props: InputObjectProps) {
		this.type = props.type;
		this.resieName = props.resieName;
		this.displayName = props.displayName;
		Object.assign(this, props);

		if (this.issue === undefined) if (this.value === undefined) this.value = null;

		if (this.value === null && !this.isRequired) {
			if (this.type === InputObjectType.STRING) this.value = '';
			// this.isIncluded = false;
		}
		if (this.type === InputObjectType.DATE) {
			const date: Date = new Date(this.value);
			if (isNaN(date.getSeconds()) || this.value === null) {
				const now = new Date();
				now.setHours(0, 0, 0);
				this.value = now;
			} else this.value = date;
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

	/**
	 * checks if input is valid using the input's validations.
	 * Sets the validationMessages that can be displayed as error messages to the user
	 */
	public checkInputValid(otherInputs: InputObject[]): void {
		this.issue = checkForInputIssues(this, otherInputs);
		console.assert(this.issue.message !== undefined, `input warning is undefined on input ${JSON.stringify(this)}`);
	}

	public isValid() {
		return this.issue.issueType !== InputIssueType.Validity && this.issue.issueType !== InputIssueType.AtLeastOne;
	}
}

export { InputObject, InputObjectType };
