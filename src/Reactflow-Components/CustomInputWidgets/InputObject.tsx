import { getUndefinedMedium } from '../../NodeDataStructures/Mediums/MediumUtils';
import type { Medium } from '../../NodeDataStructures/Mediums/Medium';
import { type Validation } from './Validation/NumberValidation';
import { ConditionalOperator, type Conditional } from './Validation/Conditionals';
import { checkForInputIssues, InputIssueType, type InputIssue } from './Validation/InputChecking';
import { exportDate, parseDate } from './DateParsing';
import type { SusiNode } from '../../NodeDataStructures/Nodes/SusiNode';

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
	COMPONENT_UAC: 'COMPONENT_UAC',
	COMPONENT_UAC_LIST: 'COMPONENT_UAC_LIST',
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
	value: string | number | Date | boolean | string[];
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
	isIncluded: boolean = false;
	dropdownOptions: Array<string> = [];
	dropdownOptionDisplayNames: Array<string> = [];
	unit: string = '';
	validations: Array<Validation> = [];
	validationMessages: string[] = [];
	conditionals: Conditional[] = [];
	issue: InputIssue = { issueType: InputIssueType.None, message: '' };

	constructor(
		props: InputObjectProps,
		isImport: boolean = false,
		startEndUnit: string | null = null,
		mediums: Medium[] = []
	) {
		this.type = props.type;
		this.resieName = props.resieName;
		this.displayName = props.displayName;
		Object.assign(this, props);
		if (isImport) this.setValueOnImport(props.value, mediums, startEndUnit);
	}

	public setValueOnImport(value: any, mediums: Medium[] = [], startEndUnit: string | null): void {
		this.value = value;
		if (this.type === InputObjectType.MEDIUM) {
			const mediumWithKey = mediums.find((m) => m.key === this.value);
			if (mediumWithKey === undefined) {
				const mediumWithName = mediums.find((m) => m.name === this.value);
				this.value = mediumWithName?.key || getUndefinedMedium().key;
			}
		}
		if (this.value === undefined) this.value = null;

		if (this.value === null && !this.isRequired) {
			if (this.type === InputObjectType.STRING) this.value = '';
		}
		if (this.type === InputObjectType.DATE) {
			const date: Date = parseDate(this.value, startEndUnit);
			this.value = date;
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
	public getNodeInputExportValue(mediums: Medium[], startEndUnit: string | null = null, nodes: SusiNode[]): any {
		if (this.type === InputObjectType.MEDIUM) {
			const mediumKey = this.value;
			const medium = mediums.find((m) => m.key === mediumKey);
			if (!medium) return 'UNDEFINED';
			return medium.name;
		}
		if (this.type === InputObjectType.DATE) {
			return exportDate(this.value, startEndUnit);
		} else if (this.type === InputObjectType.FLOAT) {
			return Number.parseFloat(this.value);
		} else if (this.type === InputObjectType.INT) {
			return Number.parseInt(this.value);
		} else if (this.type === InputObjectType.COMPONENT_UAC) {
			const node = nodes.find((e) => e.id === this.value);
			const nodeName = node ? node.data.content : 'None';
			return nodeName;
		} else if (this.type === InputObjectType.VECTOR_FLOAT) {
			const result = this.value.map((e: string) => Number.parseFloat(e));
			return result.filter((e: string) => !Number.isNaN(e));
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
		if (!this.isRequired && !this.isIncluded) return true;
		return this.issue.issueType !== InputIssueType.Validity && this.issue.issueType !== InputIssueType.AtLeastOne;
	}

	public canHaveWarnings(): boolean {
		/** does the type have type-specific validation errors */
		switch (this.type) {
			case InputObjectType.MEDIUM:
			case InputObjectType.MULTISELECT:
			case InputObjectType.BOOLEAN:
			case InputObjectType.STRING:
			case InputObjectType.DROPDOWN:
			case InputObjectType.COMPONENT_UAC:
			case InputObjectType.VECTOR_FLOAT:
			case InputObjectType.VECTOR_STRING:
			case InputObjectType.COMPONENT_UAC_LIST:
				break;
			default:
				return true;
		}
		/** Does this input have validations or mutex operators */
		const mutexConditionals = this.conditionals.filter((e) => e.operator === ConditionalOperator.mutex);
		return this.validations.length !== 0 || mutexConditionals.length !== 0;
	}
}

export { InputObject, InputObjectType };
